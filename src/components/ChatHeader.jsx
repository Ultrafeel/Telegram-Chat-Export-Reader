import React from 'react';
import { Upload, Moon, Sun } from 'lucide-react';

const ChatHeader = ({ chatTitle, chats, selectedChatIndex, onSelectChat, isLoading, isDarkMode, onToggleDarkMode, onLoadClick }) => {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {chatTitle.charAt(0).toUpperCase()}
          </div>
          <div>
            {chats?.length > 1 && selectedChatIndex !== null ? (
              <select
                aria-label="Select chat"
                value={selectedChatIndex}
                disabled={isLoading}
                onChange={event => onSelectChat(event.target.value)}
                className="max-w-[min(48vw,24rem)] bg-transparent text-lg font-semibold text-gray-900 border-0 p-0 focus:ring-0"
              >
                {chats.map((chat, index) => (
                  <option key={`${chat.id ?? index}-${index}`} value={index}>
                    {chat.name || `Chat ${index + 1}`}
                  </option>
                ))}
              </select>
            ) : (
              <h1 className="text-lg font-semibold text-gray-900">{chatTitle || 'Chat'}</h1>
            )}
            <p className="text-xs text-gray-500">Exported conversation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleDarkMode}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 px-3 py-2 rounded-full font-medium transition flex items-center gap-2 text-sm"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button
            onClick={onLoadClick}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition flex items-center gap-2 text-sm"
          >
            <Upload className="w-4 h-4" />
            Load Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;