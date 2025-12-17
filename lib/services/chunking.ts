/**
 * Document Chunking Service
 * Splits documents into chunks of 500-1000 characters with configurable overlap
 * Requirements: 3.1
 */

export interface ChunkOptions {
  minSize?: number;  // Default: 500
  maxSize?: number;  // Default: 1000
  overlap?: number;  // Default: 100
}

export interface Chunk {
  content: string;
  index: number;
  metadata: {
    startChar: number;
    endChar: number;
  };
}

const DEFAULT_OPTIONS: Required<ChunkOptions> = {
  minSize: 500,
  maxSize: 1000,
  overlap: 100,
};

/**
 * Splits a document into chunks of target size with overlap
 * @param content - The document text to chunk
 * @param options - Chunking configuration options
 * @returns Array of chunks with metadata
 */
export function chunkDocument(content: string, options?: ChunkOptions): Chunk[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const { minSize, maxSize, overlap } = opts;

  // Handle empty or very short content
  if (!content || content.length === 0) {
    return [];
  }

  // If content is shorter than minSize, return as single chunk
  if (content.length <= minSize) {
    return [{
      content,
      index: 0,
      metadata: {
        startChar: 0,
        endChar: content.length,
      },
    }];
  }

  const chunks: Chunk[] = [];
  let startChar = 0;
  let index = 0;


  while (startChar < content.length) {
    // Calculate the end position for this chunk
    let endChar = Math.min(startChar + maxSize, content.length);
    
    // If this isn't the last chunk and we're not at a natural break,
    // try to find a good break point (sentence end, paragraph, or word boundary)
    if (endChar < content.length) {
      const chunkText = content.slice(startChar, endChar);
      const breakPoint = findBreakPoint(chunkText, minSize);
      if (breakPoint > 0) {
        endChar = startChar + breakPoint;
      }
    }

    const chunkContent = content.slice(startChar, endChar);
    
    chunks.push({
      content: chunkContent,
      index,
      metadata: {
        startChar,
        endChar,
      },
    });

    // Move to next chunk position with overlap
    // For the last chunk, we're done
    if (endChar >= content.length) {
      break;
    }

    // Calculate next start position with overlap
    const nextStart = endChar - overlap;
    
    // Ensure we make progress (avoid infinite loop)
    if (nextStart <= startChar) {
      startChar = endChar;
    } else {
      startChar = nextStart;
    }
    
    index++;
  }

  return chunks;
}

/**
 * Finds a good break point in the text, preferring sentence ends, then paragraphs, then word boundaries
 * @param text - The text to search for a break point
 * @param minPosition - Minimum position for the break point
 * @returns Position of the break point, or 0 if none found
 */
function findBreakPoint(text: string, minPosition: number): number {
  // Look for sentence endings (. ! ?) followed by space or end
  const sentenceEndRegex = /[.!?]\s+/g;
  let lastSentenceEnd = 0;
  let match;
  
  while ((match = sentenceEndRegex.exec(text)) !== null) {
    const position = match.index + match[0].length;
    if (position >= minPosition && position < text.length) {
      lastSentenceEnd = position;
    }
  }
  
  if (lastSentenceEnd > 0) {
    return lastSentenceEnd;
  }

  // Look for paragraph breaks (double newline)
  const paragraphRegex = /\n\n+/g;
  let lastParagraph = 0;
  
  while ((match = paragraphRegex.exec(text)) !== null) {
    const position = match.index + match[0].length;
    if (position >= minPosition && position < text.length) {
      lastParagraph = position;
    }
  }
  
  if (lastParagraph > 0) {
    return lastParagraph;
  }

  // Look for word boundaries (space)
  const lastSpace = text.lastIndexOf(' ');
  if (lastSpace >= minPosition) {
    return lastSpace + 1;
  }

  // No good break point found
  return 0;
}
