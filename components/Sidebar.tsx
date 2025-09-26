import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { TrashIcon } from './icons/TrashIcon';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-200 dark:bg-gray-800/50 p-4 border-r border-white/10 dark:border-gray-700/50">
      <button className="flex items-center justify-center w-full px-4 py-3 mb-4 text-sm font-semibold text-white bg-gradient-to-br from-green-500 to-teal-500 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800">
        <PlusIcon className="w-5 h-5 mr-2" />
        New Chat
      </button>
      <div className="flex-1 overflow-y-auto">
        <h2 className="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Chats</h2>
        {/* Placeholder for chat history items */}
        <div className="space-y-2">
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-300/50 dark:bg-gray-700/50 rounded-lg">
                <ChatBubbleIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 truncate">React component bug</span>
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-300/50 dark:hover:bg-gray-700/50 rounded-lg group">
                <ChatBubbleIcon className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                <span className="flex-1 truncate">How to use Vite with Docker</span>
                 <TrashIcon className="w-4 h-4 ml-2 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
        </div>
      </div>
      <div className="mt-auto">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">© 2024 GGStudio</p>
      </div>
    </div>
  );
};

export default Sidebar;
