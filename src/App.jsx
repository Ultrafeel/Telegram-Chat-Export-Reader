import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import EmptyState from './components/EmptyState';
import { parseHTML } from './utils/fileHandler';
import { parseMessage, parseJsonExport } from './utils/parser';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [chatTitle, setChatTitle] = useState('');
  const [chatSelection, setChatSelection] = useState(null);
  const [selectedChatIndex, setSelectedChatIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleFolderSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setLoading(true);
    setProgress(0);
    setMessages([]);
    setChatSelection(null);
    setSelectedChatIndex(null);
    
    const firstPath = files[0].webkitRelativePath;
    const basePath = firstPath.split('/')[0];

    const jsonFile = files.find(f => f.name.toLowerCase() === 'result.json' || f.name.toLowerCase().endsWith('.json'));
    const htmlFile = files.find(f => 
      f.webkitRelativePath.endsWith('messages.html') || 
      f.webkitRelativePath.endsWith('messages1.html')
    );

    if (!htmlFile && !jsonFile) {
      alert('No messages.html or Telegram JSON export found in the selected folder');
      setLoading(false);
      return;
    }

    if (jsonFile) {
      try {
        const data = JSON.parse(await jsonFile.text());
        const chats = data.chats?.list;
        if (!Array.isArray(chats) || chats.length === 0) {
          throw new Error('The JSON export does not contain any chats.');
        }
        if (chats.length === 1) {
          const parsed = await parseJsonExport(data, files, 0);
          setChatTitle(parsed.title);
          setMessages(parsed.messages);
        } else {
          setChatSelection({ data, files, chats });
        }
      } catch (error) {
        console.error('Failed to parse Telegram JSON export:', error);
        alert('Could not read this JSON export. Make sure it is a Telegram chat export.');
      } finally {
        setLoading(false);
        setProgress(0);
      }
      return;
    }

    const text = await htmlFile.text();
    const doc = parseHTML(text);
    
    const title = doc.querySelector('.page_header .text')?.textContent.trim() || 'Chat';
    setChatTitle(title);

    const messageElements = doc.querySelectorAll('.message');
    const parsedMessages = [];
    
    const BATCH_SIZE = 100;
    for (let i = 0; i < messageElements.length; i += BATCH_SIZE) {
      const batch = Array.from(messageElements).slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(msgEl => parseMessage(msgEl, files, basePath));
      const batchResults = await Promise.all(batchPromises);
      parsedMessages.push(...batchResults);
      
      setMessages([...parsedMessages]);
      setProgress((parsedMessages.length / messageElements.length) * 100);
      
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    // Post-process to link quoted messages
    const messagesWithQuotes = parsedMessages.map(msg => {
      if (msg.replyTo && msg.replyTo.messageId && !msg.replyTo.isAnotherChat) {
        // Find the quoted message
        const quotedMsg = parsedMessages.find(m => {
          const msgId = m.id.replace('message', '');
          return msgId === msg.replyTo.messageId.toString();
        });
        
        if (quotedMsg) {
          return {
            ...msg,
            replyTo: {
              ...msg.replyTo,
              quotedMessage: quotedMsg
            }
          };
        }
      }
      return msg;
    });

    setMessages(messagesWithQuotes);
    setLoading(false);
    setProgress(0);
  };

  const handleOpenSelectedChat = async () => {
    if (!chatSelection || selectedChatIndex === null) return;
    setLoading(true);
    try {
      const parsed = await parseJsonExport(chatSelection.data, chatSelection.files, selectedChatIndex);
      setChatTitle(parsed.title);
      setMessages(parsed.messages);
      setChatSelection(null);
    } catch (error) {
      console.error('Failed to parse Telegram JSON export:', error);
      alert('Could not read this chat from the Telegram JSON export.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col app-shell">
      <ChatHeader 
        chatTitle={chatTitle} 
        isDarkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(prevMode => !prevMode)}
        onLoadClick={() => fileInputRef.current?.click()} 
      />

      {chatSelection ? (
        <main className="flex-1 overflow-y-auto px-4 py-8">
          <section className="max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Choose a chat</h2>
            <p className="text-sm text-gray-500 mb-5">Select one conversation from this export.</p>
            <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-[60vh] overflow-y-auto">
              {chatSelection.chats.map((chat, index) => (
                <label key={`${chat.id ?? index}-${index}`} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedChatIndex === index}
                    onChange={event => setSelectedChatIndex(event.target.checked ? index : null)}
                    className="h-4 w-4 accent-blue-600"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-gray-900">{chat.name || `Chat ${index + 1}`}</span>
                    <span className="block text-sm text-gray-500">{chat.messages?.length || 0} messages</span>
                  </span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleOpenSelectedChat}
              disabled={selectedChatIndex === null || loading}
              className="mt-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-md font-medium transition"
            >
              {loading ? 'Loading chat...' : 'Open chat'}
            </button>
          </section>
        </main>
      ) : messages.length === 0 ? (
        <div className="flex-1 overflow-y-auto">
          <EmptyState 
            loading={loading}
            progress={loading ? progress : null}
            onLoadClick={() => fileInputRef.current?.click()} 
          />
        </div>
      ) : (
        <MessageList messages={messages} />
      )}

      <input
        ref={fileInputRef}
        type="file"
        webkitdirectory="true"
        directory="true"
        multiple
        onChange={handleFolderSelect}
        className="hidden"
      />
    </div>
  );
};

export default App;
