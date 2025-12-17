/**
 * Document Ingestion API Route
 * Accepts document content and metadata, chunks the document,
 * generates embeddings, and stores in Supabase
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, createAdminClient } from '@/lib/supabase/server';
import { chunkDocument } from '@/lib/services/chunking';
import { generateEmbeddings } from '@/lib/services/embedding';

interface IngestRequestBody {
  content: string;
  metadata?: Record<string, unknown>;
}

interface IngestResponse {
  success: boolean;
  chunksProcessed?: number;
  error?: string;
}

/**
 * POST /api/ingest
 * Ingests a document into the knowledge base
 */
export async function POST(request: NextRequest): Promise<NextResponse<IngestResponse>> {
  try {
    // Verify user is authenticated and is an admin
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // Check if user has admin role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null; error: Error | null };

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Parse request body
    const body: IngestRequestBody = await request.json();

    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Bad Request: Document content is required' },
        { status: 400 }
      );
    }

    if (body.content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bad Request: Document content cannot be empty' },
        { status: 400 }
      );
    }

    // Chunk the document
    const chunks = chunkDocument(body.content);

    if (chunks.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Bad Request: Document produced no chunks' },
        { status: 400 }
      );
    }

    // Generate embeddings for all chunks with retry logic
    const chunkContents = chunks.map(chunk => chunk.content);
    let embeddings: number[][];
    
    const MAX_RETRIES = 3;
    const INITIAL_RETRY_DELAY = 1000;
    
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        embeddings = await generateEmbeddings(chunkContents);
        break;
      } catch (embeddingError) {
        console.error(`Embedding generation attempt ${attempt + 1} failed:`, embeddingError);
        
        if (attempt === MAX_RETRIES - 1) {
          // Last attempt failed
          const errorMessage = embeddingError instanceof Error 
            ? embeddingError.message 
            : 'Unknown embedding error';
          return NextResponse.json(
            { success: false, error: `Embedding generation failed after ${MAX_RETRIES} attempts: ${errorMessage}` },
            { status: 503 }
          );
        }
        
        // Wait before retrying with exponential backoff
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    // TypeScript safety - embeddings will be defined if we reach here
    embeddings = embeddings!;

    // Use admin client to bypass RLS for document insertion
    const adminClient = createAdminClient();

    // Prepare documents for insertion
    const documents = chunks.map((chunk, index) => ({
      content: chunk.content,
      embedding: embeddings[index],
      metadata: {
        ...body.metadata,
        chunkIndex: chunk.index,
        startChar: chunk.metadata.startChar,
        endChar: chunk.metadata.endChar,
        originalDocumentLength: body.content.length,
      },
      created_by: user.id,
    }));

    // Insert all chunks into the documents table
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: insertError } = await (adminClient
      .from('documents') as any)
      .insert(documents);

    if (insertError) {
      console.error('Error inserting documents:', insertError);
      return NextResponse.json(
        { success: false, error: `Database error: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      chunksProcessed: chunks.length,
    });

  } catch (error) {
    console.error('Ingestion error:', error);
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { success: false, error: 'Bad Request: Invalid JSON body' },
        { status: 400 }
      );
    }

    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, error: `Ingestion failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
