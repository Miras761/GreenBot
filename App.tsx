import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { Message, Sender, ChatSession } from './types';
import { getBotResponseStream } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface ImageData {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load sessions from localStorage on initial render
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('chatSessions');
      const savedActiveId = localStorage.getItem('activeChatSessionId');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions);
        setSessions(parsedSessions);
        if (savedActiveId && parsedSessions.some(s => s.id === savedActiveId)) {
          setActiveSessionId(savedActiveId);
        } else if (parsedSessions.length > 0) {
          setActiveSessionId(parsedSessions[0].id);
        } else {
          handleNewChat();
        }
      } else {
        handleNewChat();
      }
    } catch (error) {
      console.error("Failed to load sessions from localStorage", error);
      handleNewChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chatSessions', JSON.stringify(sessions));
    }
    if (activeSessionId) {
      localStorage.setItem('activeChatSessionId', activeSessionId);
    }
  }, [sessions, activeSessionId]);

  const createNewSession = (): ChatSession => ({
    id: uuidv4(),
    title: 'New Chat',
    messages: [
      {
        id: uuidv4(),
        sender: Sender.BOT,
        text: "Hello! I'm your GGStudio coding assistant. How can I help you today?",
      },
    ],
  });

  const handleNewChat = () => {
    const newSession = createNewSession();
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };
  
  const handleSelectChat = (id: string) => {
    setActiveSessionId(id);
  };
  
  const handleDeleteChat = (id: string) => {
    setSessions(prev => prev.filter(session => session.id !== id));
    if (activeSessionId === id) {
      const remainingSessions = sessions.filter(session => session.id !== id);
      if (remainingSessions.length > 0) {
        setActiveSessionId(remainingSessions[0].id);
      } else {
        // If all chats are deleted, create a new one
        const newSession = createNewSession();
        setSessions([newSession]);
        setActiveSessionId(newSession.id);
      }
    }
  };

  const handleSendMessage = async (text: string, image?: ImageData) => {
    if (!activeSessionId) return;

    const userMessage: Message = {
      id: uuidv4(),
      sender: Sender.USER,
      text: text,
      imageUrl: image?.dataUrl,
    };
    
    // Update the active session with the new message
    const updatedSessions = sessions.map(session => {
        if (session.id === activeSessionId) {
            // Auto-generate title from first user message
            const isNewChat = session.messages.length === 1;
            const newTitle = isNewChat 
                ? text.split(' ').slice(0, 5).join(' ') + (text.split(' ').length > 5 ? '...' : '')
                : session.title;

            return {
                ...session,
                title: newTitle,
                messages: [...session.messages, userMessage],
            };
        }
        return session;
    });

    setSessions(updatedSessions);
    setIsLoading(true);

    const botMessageId = uuidv4();
    // Add a placeholder for the bot's response
    setSessions(prev => prev.map(s => s.id === activeSessionId ? {...s, messages: [...s.messages, { id: botMessageId, sender: Sender.BOT, text: '...' }]} : s));

    const activeSession = updatedSessions.find(s => s.id === activeSessionId);
    if (!activeSession) {
        setIsLoading(false);
        return;
    }
    
    try {
      const stream = await getBotResponseStream(
        activeSession.messages.map(m => ({...m, text: m.text || ''})), 
        image ? { base64: image.base64, mimeType: image.mimeType } : undefined
      );

      let botResponse = '';
      const reader = stream.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botResponse += value;
        
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: s.messages.map(msg => msg.id === botMessageId ? { ...msg, text: botResponse } : msg)
            };
          }
          return s;
        }));
      }
    } catch (error) {
      console.error('Failed to get bot response:', error);
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            messages: s.messages.map(msg => msg.id === botMessageId ? { ...msg, text: 'Sorry, I encountered an error. Please try again.' } : msg)
          };
        }
        return s;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      <div className="flex flex-col flex-1">
        <Header />
        <ChatWindow messages={activeSession?.messages || []} isLoading={isLoading} />
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          disabled={!activeSessionId}
        />
      </div>
    </div>
  );
};

export default App;
