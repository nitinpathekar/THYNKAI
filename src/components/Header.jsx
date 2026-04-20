import React from 'react';

function Header({ onClearChat, onClearApiKey }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="app-title">
          ThinkAI <span style={{ fontSize: '0.7rem', color: '#666', verticalAlign: 'middle' }}>2.5 Flash</span>
        </h1>
        <div className="header-actions">
          <button onClick={onClearChat} className="header-btn">Clear Chat</button>
          <button onClick={onClearApiKey} className="header-btn">Settings</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
