import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { TrashIcon } from './icons/TrashIcon';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectChat, onDeleteChat }) => {
  
  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent onSelectChat from firing when deleting
    onDeleteChat(id);
  }
  
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-200 dark:bg-gray-800/50 p-4 border-r border-white/10 dark:border-gray-700/50">
      <button 
        onClick={onNewChat}
        className="flex items-center justify-center w-full px-4 py-3 mb-4 text-sm font-semibold text-white bg-gradient-to-br from-green-500 to-teal-500 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800"
      >
        <PlusIcon className="w-5 h-5 mr-2" />
        New Chat
      </button>
      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        <h2 className="px-2 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recent Chats</h2>
        <div className="space-y-2">
            {sessions.map(session => (
              <a 
                key={session.id}
                href="#"
                onClick={(e) => { e.preventDefault(); onSelectChat(session.id); }}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg group transition-colors duration-200 ${
                  activeSessionId === session.id
                    ? 'bg-gray-300/50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-100'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300/50 dark:hover:bg-gray-700/50'
                }`}
              >
                  <ChatBubbleIcon className="w-5 h-5 mr-3 flex-shrink-0 text-gray-500 dark:text-gray-400" />
                  <span className="flex-1 truncate">{session.title}</span>
                  <button onClick={(e) => handleDelete(e, session.id)} className="ml-2 p-1 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400 transition-opacity focus:outline-none">
                    <TrashIcon className="w-4 h-4" />
                  </button>
              </a>
            ))}
        </div>
      </div>
      <div className="mt-auto pt-4">
        <p className="text-xs text-center text-gray-500 dark:text-gray-400">© 2024 GGStudio</p>
      </div>
    </div>
  );
};

export default Sidebar;
