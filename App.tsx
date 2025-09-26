import React from 'react';
import ChatWindow from './components/ChatWindow';

const App: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-emerald-50 via-teal-100 to-cyan-100 dark:from-gray-900 dark:via-emerald-900/50 dark:to-black p-4">
      <div className="w-full max-w-2xl h-[90vh] max-h-[800px] flex flex-col bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-green-500/10 border border-white/30 dark:border-gray-700/50">
        <ChatWindow />
      </div>
    </div>
  );
};

export default App;