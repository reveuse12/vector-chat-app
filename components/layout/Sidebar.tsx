/**
 * Sidebar Component
 * Chat history sidebar with new chat button
 * Requirements: 6.3, 6.4
 */

'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Plus, MessageSquare, Loader2 } from 'lucide-react';
import type { ChatWithMessages } from '@/lib/types/database';

interface SidebarProps {
  chats: ChatWithMessages[];
  currentChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  isLoading?: boolean;
}

export function Sidebar({
  chats,
  currentChatId,
  onNewChat,
  onSelectChat,
  isLoading = false,
}: SidebarProps) {
  return (
    <aside className="w-64 border-r bg-muted/30 flex flex-col h-full">
      {/* Header with New Chat button */}
      <div className="p-4 border-b">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Chat history list */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No chat history yet
            </div>
          ) : (
            chats.map((chat) => (
              <ChatHistoryItem
                key={chat.id}
                chat={chat}
                isActive={chat.id === currentChatId}
                onClick={() => onSelectChat(chat.id)}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

interface ChatHistoryItemProps {
  chat: ChatWithMessages;
  isActive: boolean;
  onClick: () => void;
}

function ChatHistoryItem({ chat, isActive, onClick }: ChatHistoryItemProps) {
  // Get chat title or first message preview
  const title = chat.title || getFirstMessagePreview(chat) || 'New Chat';
  
  // Format date
  const date = new Date(chat.updated_at);
  const formattedDate = formatRelativeDate(date);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-3 rounded-lg transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        isActive && 'bg-accent text-accent-foreground'
      )}
    >
      <div className="flex items-start gap-2">
        <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
        </div>
      </div>
    </button>
  );
}

function getFirstMessagePreview(chat: ChatWithMessages): string | null {
  const firstUserMessage = chat.messages?.find((m) => m.role === 'user');
  if (!firstUserMessage) return null;
  
  // Truncate to first 50 characters
  const content = firstUserMessage.content;
  return content.length > 50 ? content.substring(0, 50) + '...' : content;
}

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}
