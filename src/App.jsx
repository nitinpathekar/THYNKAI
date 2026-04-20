import { useState, useEffect, useRef } from 'react';
import './App.css';

// Import components
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import ApiKeyModal from './components/ApiKeyModal';

// Import services
import { streamGeminiResponse } from './services/gemini';

const STORAGE_KEY = 'gemini_api_key';
const CHAT_HISTORY_KEY = 'gemini_chat_history';
const MODEL_NAME = 'gemini-2.5-flash';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [modalKeyInput, setModalKeyInput] = useState('');
  const messagesEndRef = useRef(null);

  // Load saved API key and history
  useEffect(() => {
    const savedKey = localStorage.getItem(STORAGE_KEY);
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowKeyModal(true);
    }

    const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (savedHistory) {
      setMessages(JSON.parse(savedHistory));
    }
  }, []);

  // Save history whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Auto‑scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = (key) => {
    if (!key.trim()) return;
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
    setShowKeyModal(false);
    setModalKeyInput('');
  };

  const clearApiKey = () => {
    localStorage.removeItem(STORAGE_KEY);
    setApiKey('');
    setShowKeyModal(true);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    if (!apiKey) {
      setShowKeyModal(true);
      return;
    }

    const userMessage = { role: 'user', text: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    // Initial placeholder for AI response
    setMessages(prev => [...prev, { role: 'assistant', text: '' }]);

    try {
      await streamGeminiResponse(
        apiKey,
        MODEL_NAME,
        newMessages,
        userMessage.text,
        (fullText) => {
          setMessages(prev =>
            prev.map((msg, idx) =>
              idx === prev.length - 1 ? { ...msg, text: fullText } : msg
            )
          );
        },
        (error) => {
          setMessages(prev => [
            ...prev.slice(0, -1),
            { role: 'error', text: `Error: ${error.message}` }
          ]);
        }
      );
    } catch (err) {
      // Error handled by the onError callback above
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app">
      <Header onClearChat={clearChat} onClearApiKey={clearApiKey} />

      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>Welcome! Ask me anything.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <ChatMessage 
              key={idx} 
              msg={msg} 
              loading={loading} 
              isLast={idx === messages.length - 1} 
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput 
        input={input} 
        setInput={setInput} 
        onSend={handleSend} 
        loading={loading} 
        handleKeyPress={handleKeyPress} 
      />

      {showKeyModal && (
        <ApiKeyModal 
          modalKeyInput={modalKeyInput} 
          setModalKeyInput={setModalKeyInput} 
          onSave={saveApiKey} 
        />
      )}
    </div>
  );
}

export default App;