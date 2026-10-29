import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Upload, Moon, Sun, Download, Code, X } from 'lucide-react';

const ChatHeader = ({ onExportHtml, chatSourceJson, chatTitle, chats, selectedChatIndex, onSelectChat, isLoading, isDarkMode, onToggleDarkMode, onLoadClick }) => {
  const [isChatJsonOpen, setIsChatJsonOpen] = useState(false);

  useEffect(() => {
    if (!isChatJsonOpen) return;
    const handleKeyDown = event => {
      if (event.key === 'Escape') setIsChatJsonOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isChatJsonOpen]);

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
          {chatSourceJson && (
            <button
              type="button"
              onClick={() => setIsChatJsonOpen(true)}
              title="View chat JSON"
              aria-label="View chat JSON"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
            >
              <Code className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          {onExportHtml && (
            <button
              onClick={onExportHtml}
              title="Media is referenced by relative path. Save the HTML into the export folder (next to result.json) so pictures and files load."
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-3 py-2 rounded-full font-medium transition flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="flex flex-col items-start leading-tight">
                Save HTML
                <span className="text-[10px] font-normal text-slate-500">place in export folder</span>
              </span>
            </button>
          )}
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
      {isChatJsonOpen && chatSourceJson && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setIsChatJsonOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="chat-source-title"
            className="w-full max-w-3xl overflow-hidden rounded-md bg-white text-gray-900 shadow-xl dark:bg-gray-900 dark:text-gray-100"
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2 id="chat-source-title" className="text-sm font-semibold">Chat JSON source</h2>
              <button
                type="button"
                onClick={() => setIsChatJsonOpen(false)}
                aria-label="Close chat JSON"
                className="inline-flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <pre className="max-h-[75vh] overflow-auto p-4 text-xs leading-relaxed">
              <code>{JSON.stringify(chatSourceJson, null, 2)}</code>
            </pre>
          </section>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ChatHeader;