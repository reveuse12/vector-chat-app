/**
 * Chat Page
 * Main chat interface with sidebar for chat history and main chat area
 * Requirements: 8.1, 8.2
 */

'use client';

import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import type { ChatWithMessages } from '@/lib/types/database';

export default function ChatPage() {
  const [chats, setChats] = useState<ChatWithMessages[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    async function loadChatHistory() {
      try {
        const response = await fetch('/api/chat/history');
        if (response.ok) {
          const data = await response.json();
          setChats(data.chats || []);
        }
      } catch (error) {
        console.error('Failed to load chat history:', error);
      } finally {
        setIsLoadingHistory(false);
      }
    }

    loadChatHistory();
  }, []);

  // Get current chat's messages
  const currentChat = chats.find(chat => chat.id === currentChatId);
  const initialMessages = currentChat?.messages || [];

  // Handle new chat creation
  const handleNewChat = () => {
    setCurrentChatId(null);
    setIsSidebarOpen(false);
  };

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
    setIsSidebarOpen(false);
  };

  // Handle chat ID update from ChatInterface (when new chat is created)
  const handleChatIdUpdate = (newChatId: string) => {
    setCurrentChatId(newChatId);
    // Refresh chat history to include the new chat
    fetch('/api/chat/history')
      .then(res => res.json())
      .then(data => setChats(data.chats || []))
      .catch(console.error);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] relative">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 left-2 z-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar for chat history */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isLoading={isLoadingHistory}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col min-w-0">
        <ChatInterface
          chatId={currentChatId}
          initialMessages={initialMessages}
          onChatIdUpdate={handleChatIdUpdate}
        />
      </main>
    </div>
  );
}
