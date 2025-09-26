import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message as MessageType, Sender } from '../types';
import { getBotResponseStream } from '../services/geminiService';
import Message from './Message';
import ChatInput from './ChatInput';
import Header from './Header';
import { BotIcon } from './icons/BotIcon';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: 'initial',
      text: "Hello! I'm GreenBot, your friendly guide to the natural world. Ask me anything about plants, animals, or ecosystems!",
      sender: Sender.BOT
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text,
      sender: Sender.USER,
    };
    
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);

    try {
      const stream = await getBotResponseStream(currentMessages);
      
      let accumulatedText = "";
      const botMessageId = (Date.now() + 1).toString();
      let botMessageAdded = false;
      
      const reader = stream.getReader();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulatedText += value; // value is already a string

        if (!botMessageAdded) {
          setMessages(prev => [
            ...prev,
            { id: botMessageId, text: accumulatedText, sender: Sender.BOT }
          ]);
          botMessageAdded = true;
        } else {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === botMessageId ? { ...msg, text: accumulatedText } : msg
            )
          );
        }
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorBotMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I seem to have a problem connecting. Please try again later.',
        sender: Sender.BOT,
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-gray-900/50 rounded-3xl">
      <Header />
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}
        {isLoading && (
           <div className="flex items-start gap-3 animate-fade-in-up">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
               <BotIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
            </div>
            <div className="px-4 py-3 rounded-2xl max-w-sm md:max-w-md bg-white dark:bg-gray-700 rounded-bl-none shadow-md">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow;