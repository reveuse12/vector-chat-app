/**
 * Database types for the RAG Chat Application
 * Requirements: 7.2, 7.3
 */

// User profile with role-based access
export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}

// Document chunk stored in knowledge base with vector embedding
export interface Document {
  id: string;
  content: string;
  embedding?: number[];
  metadata: Record<string, unknown>;
  created_at: string;
  created_by: string | null;
}

// Chat session for a user
export interface Chat {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

// Individual message within a chat
export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

// Document returned from similarity search
export interface RetrievedDocument {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

// Supabase Database type definition for type-safe queries
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'> & { created_at?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Document, 'id'>>;
      };
      chats: {
        Row: Chat;
        Insert: Omit<Chat, 'id' | 'created_at' | 'updated_at'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Chat, 'id'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Message, 'id'>>;
      };
    };
    Functions: {
      match_documents: {
        Args: {
          query_embedding: number[];
          match_threshold?: number;
          match_count?: number;
        };
        Returns: RetrievedDocument[];
      };
    };
  };
}

// Chat with messages included (for loading full conversation)
export interface ChatWithMessages extends Chat {
  messages: Message[];
}

// Input types for creating new records
export type NewDocument = Database['public']['Tables']['documents']['Insert'];
export type NewChat = Database['public']['Tables']['chats']['Insert'];
export type NewMessage = Database['public']['Tables']['messages']['Insert'];
