import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function ChatMessage({ msg, loading, isLast }) {
  return (
    <div className={`message-row ${msg.role}`}>
      <div className={`message-bubble ${msg.role}`}>
        {msg.role === 'assistant' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {msg.text || (loading && isLast ? '...' : '')}
          </ReactMarkdown>
        ) : (
          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
