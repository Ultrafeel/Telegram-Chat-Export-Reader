import React from 'react';
import { Send, FolderOpen, Shield } from 'lucide-react';
import offlineGuide from '../GoOffline.md?raw';

const renderInline = (text, keyPrefix) => text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, index) => {
  if (part.startsWith('**')) return <strong key={`${keyPrefix}-${index}`}>{part.slice(2, -2)}</strong>;
  if (part.startsWith('`')) return <code key={`${keyPrefix}-${index}`}>{part.slice(1, -1)}</code>;
  return part;
});

const renderGuide = markdown => {
  const lines = markdown.trim().split('\n');
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }

    const heading = line.match(/^(#{1,2})\s+(.+)$/);
    if (heading) {
      const Heading = heading[1].length === 1 ? 'h1' : 'h2';
      blocks.push(<Heading key={index}>{renderInline(heading[2], `heading-${index}`)}</Heading>);
      index += 1;
      continue;
    }

    const isOrderedList = /^\d+\.\s+/.test(line);
    const isUnorderedList = /^-\s+/.test(line);
    if (isOrderedList || isUnorderedList) {
      const items = [];
      while (index < lines.length) {
        const item = lines[index].trim();
        if (isOrderedList ? !/^\d+\.\s+/.test(item) : !/^-\s+/.test(item)) break;
        items.push(item.replace(isOrderedList ? /^\d+\.\s+/ : /^-\s+/, ''));
        index += 1;
      }
      const List = isOrderedList ? 'ol' : 'ul';
      blocks.push(
        <List key={`list-${index}`}>
          {items.map((item, itemIndex) => <li key={itemIndex}>{renderInline(item, `list-${index}-${itemIndex}`)}</li>)}
        </List>
      );
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,2})\s+|^\d+\.\s+|^-\s+/.test(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{renderInline(paragraph.join(' '), `paragraph-${index}`)}</p>);
  }

  return blocks;
};

const EmptyState = ({ onLoadClick, loading, progress }) => {
  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading messages...</p>
        {progress && (
          <div className="mt-6 max-w-xs mx-auto">
            <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}%</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="text-center py-24">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
        <Send className="w-10 h-10 text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">No Chat Loaded</h2>
      <p className="text-gray-500 mb-8">Load a Telegram export folder to view the conversation</p>
      <button
        onClick={onLoadClick}
        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-medium transition inline-flex items-center gap-2"
      >
        <FolderOpen className="w-5 h-5" />
        Load Telegram Export
      </button>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <details className="mx-auto max-w-3xl rounded-lg bg-green-50 p-4 text-left">
          <summary className="cursor-pointer">
            <span className="inline-flex items-start gap-3 align-top">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
              <span>
                <span className="block font-medium text-green-900">100% Private &amp; Local</span>
                <span className="mt-1 block text-sm text-green-700">All processing happens in your browser. Your data is never uploaded or stored anywhere. If you want to verify this, you can switch the tab to Offline in Developer Tools, but it is not necessary. Click this section to view the offline guide.</span>
              </span>
            </span>
          </summary>
          <div className="mt-4 border-t border-green-200 pt-4 text-sm leading-6 text-gray-700 [&_h1]:mb-3 [&_h1]:text-xl [&_h1]:font-semibold [&_h1]:text-gray-900 [&_h2]:mb-2 [&_h2]:mt-5 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-900 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_code]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:py-0.5">
            {renderGuide(offlineGuide)}
          </div>
        </details>
      </div>
    </div>
  );
};

export default EmptyState;