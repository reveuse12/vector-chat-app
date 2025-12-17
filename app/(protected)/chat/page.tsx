/**
 * Chat Page
 * Main chat interface with sidebar for chat history and main chat area
 * Requirements: 8.1, 8.2
 */

'use client';

import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Sidebar } from '@/components/layout/Sidebar';
import type { ChatWithMessages } from '@/lib/types/database';

export default function ChatPage() {
  const [chats, setChats] = useState<ChatWithMessages[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

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
  };

  // Handle chat selection
  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId);
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
    <div className="flex h-screen">
      {/* Sidebar for chat history */}
      <Sidebar
        chats={chats}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isLoading={isLoadingHistory}
      />

      {/* Main chat area */}
      <main className="flex-1 flex flex-col">
        <ChatInterface
          chatId={currentChatId}
          initialMessages={initialMessages}
          onChatIdUpdate={handleChatIdUpdate}
        />
      </main>
    </div>
  );
}
