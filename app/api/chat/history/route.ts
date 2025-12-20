/**
 * Chat History API Route
 * Returns all chats for the authenticated user with their messages
 * Requirements: 6.3
 */

import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import type { Chat, Message, ChatWithMessages } from '@/lib/types/database';

interface ChatHistoryResponse {
  chats: ChatWithMessages[];
  error?: string;
}

/**
 * GET /api/chat/history
 * Retrieves all chats for the authenticated user
 */
export async function GET(): Promise<NextResponse<ChatHistoryResponse>> {
  try {
    // Get authenticated user
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { chats: [], error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all chats for the user, ordered by most recent first
    const { data: chats, error: chatsError } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('chats') as any)
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (chatsError) {
      console.error('Error fetching chats:', chatsError);
      return NextResponse.json(
        { chats: [], error: 'Failed to fetch chat history' },
        { status: 500 }
      );
    }

    if (!chats || chats.length === 0) {
      return NextResponse.json({ chats: [] });
    }

    // Fetch messages for all chats
    const chatIds = chats.map((chat: Chat) => chat.id);
    
    const { data: messages, error: messagesError } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('messages') as any)
      .select('*')
      .in('chat_id', chatIds)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      // Return chats without messages rather than failing completely
      return NextResponse.json({
        chats: chats.map((chat: Chat) => ({ ...chat, messages: [] })),
      });
    }

    // Group messages by chat_id
    const messagesByChat = new Map<string, Message[]>();
    if (messages) {
      for (const message of messages) {
        const chatMessages = messagesByChat.get(message.chat_id) || [];
        chatMessages.push(message);
        messagesByChat.set(message.chat_id, chatMessages);
      }
    }

    // Combine chats with their messages
    const chatsWithMessages: ChatWithMessages[] = chats.map((chat: Chat) => ({
      ...chat,
      messages: messagesByChat.get(chat.id) || [],
    }));

    return NextResponse.json({ chats: chatsWithMessages });

  } catch (error) {
    console.error('Chat history error:', error);
    return NextResponse.json(
      { chats: [], error: 'An error occurred while fetching chat history' },
      { status: 500 }
    );
  }
}
