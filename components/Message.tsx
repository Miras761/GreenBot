import React from 'react';
import { Message, Sender } from '../types';
import { BotIcon } from './icons/BotIcon';

interface MessageProps {
  message: Message;
}

const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.sender === Sender.USER;

  return (
    <div className={`flex items-start gap-3 animate-fade-in-up ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center ring-2 ring-white dark:ring-gray-800">
          <BotIcon className="w-5 h-5 text-green-500 dark:text-green-400" />
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-2xl max-w-sm md:max-w-md break-words shadow-md ${
          isUser
            ? 'bg-gradient-to-br from-green-500 to-teal-500 text-white rounded-br-none'
            : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.text}</p>
      </div>
    </div>
  );
};

export default MessageComponent;