import React from 'react';
import { BotIcon } from './icons/BotIcon';

const Header: React.FC = () => {
  return (
    <div className="flex items-center p-4 border-b border-white/20 dark:border-gray-700/50">
      <div className="relative">
        <BotIcon className="w-11 h-11 text-green-500 dark:text-green-400" />
        <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white/80 dark:border-gray-800/80 animate-pulse"></span>
      </div>
      <div className="ml-4">
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-500 dark:from-green-400 dark:to-teal-300">
          GGStudio Bot
        </h1>
        <p className="text-sm text-green-700 dark:text-green-400 opacity-80">Coding Assistant</p>
      </div>
    </div>
  );
};

export default Header;
