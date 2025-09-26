import React, { useState } from 'react';
import { SendIcon } from './icons/SendIcon';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <div className="p-4 border-t border-white/20 dark:border-gray-700/50 bg-transparent">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Ask GreenBot anything..."
          className="flex-1 px-5 py-3 bg-gray-100/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:border-green-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300"
          disabled={isLoading}
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className="p-3 bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
          aria-label="Send message"
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;