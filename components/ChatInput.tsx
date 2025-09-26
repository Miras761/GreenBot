import React, { useState, useRef } from 'react';
import { SendIcon } from './icons/SendIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';
import { CloseIcon } from './icons/CloseIcon';

interface ImageData {
  base64: string;
  mimeType: string;
  dataUrl: string;
}

interface ChatInputProps {
  onSendMessage: (text: string, image?: ImageData) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, disabled = false }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<ImageData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(',')[1];
        setImage({ base64, mimeType: file.type, dataUrl });
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow selecting the same file again
    event.target.value = '';
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setImage(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((text.trim() || image) && !isLoading && !disabled) {
      onSendMessage(text, image);
      setText('');
      setImage(null);
    }
  };

  return (
    <div className="p-4 border-t border-white/20 dark:border-gray-700/50 bg-transparent">
      {image && (
        <div className="relative w-24 h-24 mb-2 p-1 border border-gray-300 dark:border-gray-600 rounded-lg">
          <img src={image.dataUrl} alt="Preview" className="w-full h-full object-cover rounded" />
          <button 
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-gray-700 dark:bg-gray-200 text-white dark:text-black rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            aria-label="Remove image"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
        <button
          type="button"
          onClick={handleAttachClick}
          disabled={isLoading || disabled}
          className="p-3 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800 disabled:opacity-50"
          aria-label="Attach file"
        >
          <PaperclipIcon className="w-6 h-6" />
        </button>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={disabled ? "Select or create a new chat" : "Ask about your code..."}
          className="flex-1 px-5 py-3 bg-gray-100/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:border-green-500 focus:bg-white dark:focus:bg-gray-700 transition-all duration-300"
          disabled={isLoading || disabled}
          aria-label="Chat input"
        />
        <button
          type="submit"
          disabled={isLoading || disabled || (!text.trim() && !image)}
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
