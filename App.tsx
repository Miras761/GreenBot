import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import ChatInput from './components/ChatInput';
import { Message, Sender } from './types';
import { getBotResponseStream } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface ImageData {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start with a welcome message from the bot
    setMessages([
      {
        id: uuidv4(),
        sender: Sender.BOT,
        text: "Hello! I'm your GGStudio coding assistant. How can I help you today?",
      },
    ]);
  }, []);

  const handleSendMessage = async (text: string, image?: ImageData) => {
    const userMessage: Message = {
      id: uuidv4(),
      sender: Sender.USER,
      text: text,
      imageUrl: image?.dataUrl,
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const botMessageId = uuidv4();
    // Add a placeholder for the bot's response
    setMessages(prev => [...prev, { id: botMessageId, sender: Sender.BOT, text: '...' }]);

    try {
      const stream = await getBotResponseStream(
        newMessages.map(m => ({...m, text: m.text || ''})), // API expects text
        image ? { base64: image.base64, mimeType: image.mimeType } : undefined
      );

      let botResponse = '';
      const reader = stream.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        botResponse += decoder.decode(value, { stream: true });
        setMessages(prev =>
          prev.map(msg =>
            msg.id === botMessageId ? { ...msg, text: botResponse } : msg
          )
        );
      }
    } catch (error) {
      console.error('Failed to get bot response:', error);
      setMessages(prev =>
        prev.map(msg =>
          msg.id === botMessageId
            ? { ...msg, text: 'Sorry, I encountered an error. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <ChatWindow messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default App;
