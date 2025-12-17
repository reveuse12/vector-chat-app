/**
 * RAG (Retrieval-Augmented Generation) Service
 * Retrieves relevant context from the knowledge base and builds augmented prompts
 * Requirements: 4.2, 4.3, 5.1, 5.2
 */

import { createAdminClient } from '@/lib/supabase/server';
import { generateEmbedding } from './embedding';
import type { RetrievedDocument } from '@/lib/types/database';

// Default configuration for context retrieval
const DEFAULT_MATCH_THRESHOLD = 0.7;
const DEFAULT_MATCH_COUNT = 5;

/**
 * Retrieved context with content and similarity score
 */
export interface RetrievedContext {
  content: string;
  similarity: number;
  metadata: Record<string, unknown>;
}

/**
 * Retrieves relevant context from the knowledge base for a given query
 * @param query - The user's query text
 * @param limit - Maximum number of documents to retrieve (default: 5)
 * @param threshold - Minimum similarity threshold (default: 0.7)
 * @returns Array of retrieved context chunks ordered by similarity (descending)
 */
export async function retrieveContext(
  query: string,
  limit: number = DEFAULT_MATCH_COUNT,
  threshold: number = DEFAULT_MATCH_THRESHOLD
): Promise<RetrievedContext[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  // Generate embedding for the query
  const queryEmbedding = await generateEmbedding(query);

  // Call the match_documents RPC function
  const supabase = createAdminClient();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.rpc as any)('match_documents', {
    query_embedding: queryEmbedding,
    match_threshold: threshold,
    match_count: limit,
  }) as { data: RetrievedDocument[] | null; error: Error | null };

  if (error) {
    console.error('Error retrieving context:', error);
    throw new Error(`Failed to retrieve context: ${error.message}`);
  }

  if (!data || data.length === 0) {
    return [];
  }

  // Map database results to RetrievedContext format
  // Results are already ordered by similarity from the RPC function
  return data.map((doc) => ({
    content: doc.content,
    similarity: doc.similarity,
    metadata: doc.metadata,
  }));
}

/**
 * Builds an augmented system prompt by injecting retrieved context
 * @param basePrompt - The base system prompt
 * @param context - Array of retrieved context chunks
 * @returns Augmented prompt with context injected
 */
export function buildAugmentedPrompt(
  basePrompt: string,
  context: RetrievedContext[]
): string {
  if (!context || context.length === 0) {
    return basePrompt;
  }

  // Build context section with all retrieved chunks
  const contextSection = context
    .map((ctx, index) => {
      const similarityPercent = (ctx.similarity * 100).toFixed(1);
      return `[Context ${index + 1}] (Relevance: ${similarityPercent}%)\n${ctx.content}`;
    })
    .join('\n\n');

  // Inject context into the system prompt
  const augmentedPrompt = `${basePrompt}

## Relevant Knowledge Base Context

The following context has been retrieved from the knowledge base to help answer the user's question. Use this information to provide accurate and helpful responses.

${contextSection}

## Instructions

- Use the provided context to answer the user's question accurately
- If the context doesn't contain relevant information, acknowledge this and provide the best response you can
- Always cite or reference the context when using information from it
- Be helpful, clear, and concise in your responses`;

  return augmentedPrompt;
}

/**
 * RAG service interface for dependency injection
 */
export interface RAGService {
  retrieveContext(
    query: string,
    limit?: number,
    threshold?: number
  ): Promise<RetrievedContext[]>;
  buildAugmentedPrompt(basePrompt: string, context: RetrievedContext[]): string;
}

/**
 * Default RAG service implementation
 */
export const ragService: RAGService = {
  retrieveContext,
  buildAugmentedPrompt,
};

/**
 * Default base system prompt for the RAG chat
 */
export const DEFAULT_SYSTEM_PROMPT = `You are a helpful AI assistant with access to a knowledge base. Your role is to provide accurate, helpful, and contextual responses based on the information available to you.

Key behaviors:
- Be accurate and factual in your responses
- Acknowledge when you don't have enough information to answer
- Be concise but thorough
- Maintain a friendly and professional tone`;

/**
 * System prompt when no context is found in the knowledge base
 */
export const NO_CONTEXT_SYSTEM_PROMPT = `You are a helpful AI assistant. The knowledge base does not contain relevant information for this query.

Key behaviors:
- Acknowledge that you don't have specific information from the knowledge base
- Provide helpful general information if possible
- Suggest that the user may want to ask about topics that are in the knowledge base
- Be honest about the limitations of your knowledge
- Maintain a friendly and professional tone`;
