/**
 * Embedding Service
 * Generates vector embeddings using Google's embedding-001 model
 * Requirements: 3.2, 4.1
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getGoogleAIKey } from '@/lib/config';

// embedding-001 model produces 768-dimension vectors
export const EMBEDDING_DIMENSIONS = 768;

// Model name for embeddings
const EMBEDDING_MODEL = 'embedding-001';

/**
 * Creates a Google Generative AI client instance
 */
function getGoogleAI(): GoogleGenerativeAI {
  const apiKey = getGoogleAIKey();
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Generates a vector embedding for a single text input
 * @param text - The text to generate an embedding for
 * @returns A 768-dimension vector representing the text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    throw new Error('Cannot generate embedding for empty text');
  }

  const genAI = getGoogleAI();
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  
  const result = await model.embedContent(text);
  const embedding = result.embedding.values;
  
  if (embedding.length !== EMBEDDING_DIMENSIONS) {
    throw new Error(
      `Unexpected embedding dimension: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`
    );
  }
  
  return embedding;
}


/**
 * Generates vector embeddings for multiple text inputs (batch processing)
 * @param texts - Array of texts to generate embeddings for
 * @returns Array of 768-dimension vectors, one for each input text
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (!texts || texts.length === 0) {
    return [];
  }

  // Filter out empty texts and track their indices
  const validTexts: { text: string; originalIndex: number }[] = [];
  for (let i = 0; i < texts.length; i++) {
    if (texts[i] && texts[i].trim().length > 0) {
      validTexts.push({ text: texts[i], originalIndex: i });
    }
  }

  if (validTexts.length === 0) {
    throw new Error('All provided texts are empty');
  }

  const genAI = getGoogleAI();
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });

  // Process embeddings in batch using batchEmbedContents
  const result = await model.batchEmbedContents({
    requests: validTexts.map(({ text }) => ({
      content: { parts: [{ text }], role: 'user' },
    })),
  });

  // Map results back to original indices
  const embeddings: number[][] = new Array(texts.length).fill(null);
  
  for (let i = 0; i < result.embeddings.length; i++) {
    const embedding = result.embeddings[i].values;
    const originalIndex = validTexts[i].originalIndex;
    
    if (embedding.length !== EMBEDDING_DIMENSIONS) {
      throw new Error(
        `Unexpected embedding dimension at index ${originalIndex}: expected ${EMBEDDING_DIMENSIONS}, got ${embedding.length}`
      );
    }
    
    embeddings[originalIndex] = embedding;
  }

  // Check for any null entries (shouldn't happen if we filtered correctly)
  for (let i = 0; i < embeddings.length; i++) {
    if (embeddings[i] === null) {
      throw new Error(`Failed to generate embedding for text at index ${i}`);
    }
  }

  return embeddings;
}

/**
 * Embedding service interface for dependency injection
 */
export interface EmbeddingService {
  generateEmbedding(text: string): Promise<number[]>;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

/**
 * Default embedding service implementation
 */
export const embeddingService: EmbeddingService = {
  generateEmbedding,
  generateEmbeddings,
};
