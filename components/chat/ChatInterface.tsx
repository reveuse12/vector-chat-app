/**
 * ChatInterface Component
 * Main chat component using useChat hook from Vercel AI SDK
 * Requirements: 5.3, 5.4, 8.1, 4.4, 5.5
 */

'use client';

import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { useEffect, useRef, useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import type { Message } from '@/lib/types/database';

// Retry configuration for rate limiting
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface ChatInterfaceProps {
  chatId: string | null;
  initialMessages?: Message[];
  onChatIdUpdate?: (chatId: string) => void;
}

export function ChatInterface({
  chatId,
  initialMessages = [],
  onChatIdUpdate,
}: ChatInterfaceProps) {
  const chatIdRef = useRef(chatId);
  const onChatIdUpdateRef = useRef(onChatIdUpdate);
  const [retryCount, setRetryCount] = useState(0);

  // Keep refs updated
  useEffect(() => {
    chatIdRef.current = chatId;
    onChatIdUpdateRef.current = onChatIdUpdate;
  }, [chatId, onChatIdUpdate]);

  // Fetch with retry logic for rate limiting and network errors
  const fetchWithRetry = useCallback(async (
    input: RequestInfo | URL,
    init?: RequestInit,
    attempt = 0
  ): Promise<Response> => {
    try {
      const response = await fetch(input, init);
      
      // Handle rate limiting with retry
      if (response.status === 429 && attempt < MAX_RETRIES) {
        const retryAfter = response.headers.get('Retry-After');
        const delay = retryAfter 
          ? parseInt(retryAfter, 10) * 1000 
          : INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        
        toast.warning('Rate limited', {
          description: `Too many requests. Retrying in ${Math.ceil(delay / 1000)} seconds...`,
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        setRetryCount(prev => prev + 1);
        return fetchWithRetry(input, init, attempt + 1);
      }

      // Handle server errors with retry
      if (response.status >= 500 && attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        
        toast.warning('Server error', {
          description: `Server temporarily unavailable. Retrying in ${Math.ceil(delay / 1000)} seconds...`,
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        setRetryCount(prev => prev + 1);
        return fetchWithRetry(input, init, attempt + 1);
      }

      // Reset retry count on success
      if (response.ok) {
        setRetryCount(0);
      }

      return response;
    } catch (error) {
      // Handle network errors with retry
      if (attempt < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        
        toast.warning('Network error', {
          description: `Connection failed. Retrying in ${Math.ceil(delay / 1000)} seconds...`,
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        setRetryCount(prev => prev + 1);
        return fetchWithRetry(input, init, attempt + 1);
      }
      
      throw error;
    }
  }, []);

  // Create transport with custom body preparation
  const transport = useMemo(() => {
    return new TextStreamChatTransport({
      api: '/api/chat',
      prepareSendMessagesRequest: async ({ messages: msgs }) => {
        return {
          body: {
            messages: msgs.map(m => ({
              role: m.role,
              content: m.parts?.map(p => 'text' in p ? p.text : '').join('') || '',
            })),
            chatId: chatIdRef.current,
          },
        };
      },
      fetch: async (input, init) => {
        const response = await fetchWithRetry(input, init);
        
        // Extract chat ID from response headers for new chats
        const newChatId = response.headers.get('X-Chat-Id');
        if (newChatId && !chatIdRef.current && onChatIdUpdateRef.current) {
          chatIdRef.current = newChatId;
          onChatIdUpdateRef.current(newChatId);
        }

        return response;
      },
    });
  }, [fetchWithRetry]);

  const {
    messages,
    status,
    setMessages,
    sendMessage,
  } = useChat({
    id: chatId || undefined,
    transport,
    onError: (error: Error) => {
      console.error('Chat error:', error);
      
      // Show user-friendly error messages
      if (error.message.includes('rate')) {
        toast.error('Rate limit exceeded', {
          description: 'Please wait a moment before sending another message.',
        });
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        toast.error('Connection error', {
          description: 'Unable to connect to the server. Please check your internet connection.',
        });
      } else if (error.message.includes('Unauthorized')) {
        toast.error('Session expired', {
          description: 'Please sign in again to continue.',
        });
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        toast.error('Chat error', {
          description: 'Something went wrong. Please try again.',
        });
      }
    },
  });

  // Reset messages when chatId changes (switching chats or new chat)
  useEffect(() => {
    if (chatId === null) {
      // New chat - clear messages
      setMessages([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  // Custom submit handler that works with ChatInput
  const onSubmit = async (message: string) => {
    await sendMessage({
      text: message,
    });
  };

  // Determine if loading
  const isLoading = status === 'streaming' || status === 'submitted';

  // Convert messages to the format expected by MessageList
  const displayMessages = messages.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant' | 'system',
    content: msg.parts
      ?.map((p) => ('text' in p ? p.text : ''))
      .join('') || '',
  }));

  return (
    <div className="flex flex-col h-full">
      <MessageList messages={displayMessages} isLoading={isLoading} />
      <ChatInput onSubmit={onSubmit} isLoading={isLoading} />
    </div>
  );
}
