/**
 * Chat API Route with RAG
 * Handles chat messages with retrieval-augmented generation
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.4
 */

import { xai } from '@ai-sdk/xai';
import { streamText } from 'ai';
import { createServerClient } from '@/lib/supabase/server';
import { retrieveContext, buildAugmentedPrompt, DEFAULT_SYSTEM_PROMPT, NO_CONTEXT_SYSTEM_PROMPT, RetrievedContext } from '@/lib/services/rag';

// Maximum number of context chunks to retrieve
const MAX_CONTEXT_CHUNKS = 5;

/**
 * POST /api/chat
 * Handles chat messages with RAG-augmented responses
 */
export async function POST(request: Request) {
  try {
    // Get authenticated user
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await request.json();
    const { messages, chatId } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the latest user message for context retrieval
    const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop();
    
    if (!lastUserMessage) {
      return new Response(
        JSON.stringify({ error: 'No user message found' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create or get chat session
    let currentChatId = chatId;
    if (!currentChatId) {
      // Create new chat session
      const { data: chat, error: chatError } = await (supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('chats') as any)
        .insert({
          user_id: user.id,
          title: lastUserMessage.content.substring(0, 100),
        })
        .select()
        .single();

      if (chatError || !chat) {
        console.error('Error creating chat:', chatError);
        return new Response(
          JSON.stringify({ error: 'Failed to create chat session' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      currentChatId = chat.id;
    }

    // Persist user message before AI response
    const { error: userMsgError } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('messages') as any)
      .insert({
        chat_id: currentChatId,
        role: 'user',
        content: lastUserMessage.content,
      });

    if (userMsgError) {
      console.error('Error persisting user message:', userMsgError);
      // Continue anyway - don't fail the chat for persistence issues
    }

    // Retrieve relevant context from knowledge base
    let context: RetrievedContext[] = [];
    let systemPrompt = NO_CONTEXT_SYSTEM_PROMPT;
    
    try {
      context = await retrieveContext(lastUserMessage.content, MAX_CONTEXT_CHUNKS);
      // Build augmented system prompt with context
      const basePrompt = context.length > 0 ? DEFAULT_SYSTEM_PROMPT : NO_CONTEXT_SYSTEM_PROMPT;
      systemPrompt = buildAugmentedPrompt(basePrompt, context);
    } catch (ragError) {
      console.error('Error retrieving context (continuing without RAG):', ragError);
      // Continue without context if RAG fails - use simple prompt
      systemPrompt = 'You are a helpful AI assistant. Answer the user\'s questions helpfully and concisely.';
    }

    // Stream response from Grok using Vercel AI SDK
    const result = streamText({
      model: xai('grok-3-mini'),
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      onFinish: async ({ text }) => {
        // Persist AI response after streaming completes
        const { error: assistantMsgError } = await (supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .from('messages') as any)
          .insert({
            chat_id: currentChatId,
            role: 'assistant',
            content: text,
          });

        if (assistantMsgError) {
          console.error('Error persisting assistant message:', assistantMsgError);
        }

        // Update chat's updated_at timestamp
        await (supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .from('chats') as any)
          .update({ updated_at: new Date().toISOString() })
          .eq('id', currentChatId);
      },
    });

    // Return streaming response with chat ID in headers
    const response = result.toTextStreamResponse();
    
    // Add chat ID to response headers for client to track
    const headers = new Headers(response.headers);
    headers.set('X-Chat-Id', currentChatId);
    
    return new Response(response.body, {
      status: response.status,
      headers,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle specific error types
    if (error instanceof SyntaxError) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check for rate limiting
    if (error instanceof Error && error.message.includes('rate')) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'An error occurred while processing your request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
