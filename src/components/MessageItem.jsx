import React, { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Code, Forward, X } from 'lucide-react';
import MediaItem from './MediaItem';
import FormattedText from './FormattedText';

const MessageSourceButton = ({ sourceJson }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = event => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!sourceJson) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        title="View message JSON"
        aria-label="View message JSON"
        className="inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      >
        <Code size={15} aria-hidden="true" />
      </button>
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={event => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-source-title"
            className="w-full max-w-3xl overflow-hidden rounded-md bg-white text-gray-900 shadow-xl dark:bg-gray-900 dark:text-gray-100"
          >
            <header className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
              <h2 id="message-source-title" className="text-sm font-semibold">Message JSON source</h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close JSON source"
                className="inline-flex h-8 w-8 items-center justify-center rounded text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <pre className="max-h-[75vh] overflow-auto p-4 text-xs leading-relaxed">
              <code>{JSON.stringify(sourceJson, null, 2)}</code>
            </pre>
          </section>
        </div>,
        document.body
      )}
    </>
  );
};

const MessageItem = memo(({ message, index, onHeightChange, onOpenGlobalMedia }) => {
  const itemRef = useRef(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (itemRef.current) {
      const height = itemRef.current.offsetHeight;
      onHeightChange(index, height);
    }
  }, [message, index, onHeightChange]);

  if (message.type === 'service') {
    return (
      <div
        ref={itemRef}
        className="my-6 text-center"
      >
        <div className="inline-flex items-center gap-2">
          <div className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1.5 rounded-full">
            {message.text}
          </div>
          <MessageSourceButton sourceJson={message.sourceJson} />
        </div>
      </div>
    );
  }

  // Regular message
  const colors = [
    'bg-blue-100 text-blue-700',
    'bg-purple-100 text-purple-700',
    'bg-green-100 text-green-700',
    'bg-yellow-100 text-yellow-700',
    'bg-pink-100 text-pink-700',
  ];

  const avatarName = message.forwardedFrom || message.from || '';
  const avatarInitials = message.forwardedFrom
    ? avatarName.split(/\s+/).map(word => word[0] || '').slice(0, 2).join('').toUpperCase()
    : message.initials;
  const colorIndex = (avatarInitials?.charCodeAt(0) || 0) % colors.length;
  const bgColor = colors[colorIndex];

  // Filter out invalid media items
  const validMedia = (message.media || []).filter(item => item && typeof item === 'object' && item.type);

  // Check if this is a "joined" message (no user info)
  const isJoinedMessage = !message.from || !message.initials;

  return (
    <div ref={itemRef} className={`mb-4 flex gap-2 ${message.joined ? 'pl-10' : ''}`}>
      {/* Avatar - only show if not a joined message */}
      {!isJoinedMessage && (
        <div
          className={`relative w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${bgColor}`}
        >
          {avatarInitials || '?'}
          {message.forwardedFrom && (
            <span title="Forwarded message" className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-gray-600 shadow-sm">
              <Forward size={10} aria-hidden="true" />
            </span>
          )}
        </div>
      )}

      {/* Message content */}
      <div className="flex-1 max-w-2xl">
        {!isJoinedMessage && (
          <div className="flex items-baseline justify-between gap-2 px-3 pt-1">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold text-sm text-gray-900">{message.from}</span>
              <span className="text-xs text-gray-500">{message.time}</span>
            </div>
            <MessageSourceButton sourceJson={message.sourceJson} />
          </div>
        )}

        {message.forwardedFrom && (
          <div className="px-3 mt-1 text-xs text-gray-500">
            Forwarded from <span className="font-medium text-gray-700">{message.forwardedFrom}</span>
          </div>
        )}

        {isJoinedMessage && (message.time || message.sourceJson) && (
          <div className="flex items-center justify-between mb-1 px-3">
            <span className="text-xs text-gray-500">{message.time}</span>
            <MessageSourceButton sourceJson={message.sourceJson} />
          </div>
        )}

        {/* Reply/Quote section */}
        {message.replyTo && (
          <div className={`mx-3 mb-3 rounded-lg border-l-4 overflow-hidden ${
            message.replyTo.isAnotherChat
              ? 'bg-amber-50 border-amber-400'
              : 'bg-blue-50 border-blue-400'
          }`}>
            <div className={`px-4 py-3 text-sm ${
              message.replyTo.isAnotherChat
                ? 'text-amber-900'
                : 'text-blue-900'
            }`}>
              {message.replyTo.isAnotherChat && (
                <div className="font-semibold mb-2 flex items-center gap-1.5 text-amber-700">
                  <span>💬</span>
                  <span>Quote from another chat</span>
                </div>
              )}
              
              {/* Quoted message content */}
              {message.replyTo.quotedMessage ? (
                <div>
                  {message.replyTo.quotedMessage.from && (
                    <div className="font-semibold text-xs mb-1 opacity-75">
                      {message.replyTo.quotedMessage.from}
                    </div>
                  )}
                  <div className="font-medium leading-snug">
                    {message.replyTo.quotedMessage.formattedHTML ? (
                      <FormattedText html={message.replyTo.quotedMessage.formattedHTML} />
                    ) : (
                      message.replyTo.quotedMessage.text
                    )}
                  </div>
                </div>
              ) : (
                <div className="font-medium leading-snug">{message.replyTo.text}</div>
              )}
            </div>
          </div>
        )}

        {/* Text content */}
        {message.formattedHTML ? (
          <div className="px-3">
            <FormattedText html={message.formattedHTML} />
          </div>
        ) : message.text ? (
          <div className="text-sm text-gray-900 break-words whitespace-pre-wrap px-3">
            {message.text}
          </div>
        ) : null}

        {/* Media content */}
        {validMedia.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 px-3">
            {validMedia.map((item, idx) => (
              <MediaItem 
                key={`${message.id}-${idx}`} 
                item={item}
                mediaIndex={idx}
                totalMedia={validMedia.length}
                allMedia={validMedia}
                onMediaOpen={(localIndex) => {
                  setCurrentMediaIndex(localIndex);
                  if (onOpenGlobalMedia) onOpenGlobalMedia(localIndex);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

MessageItem.displayName = 'MessageItem';

export default MessageItem;
