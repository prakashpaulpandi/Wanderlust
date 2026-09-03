import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../../services/geminiService';
import './ChatBot.css';

const SUGGESTED_QUESTIONS = [
  'How many days should I spend here?',
  'What\'s the best time to visit?',
  'What are the must-try local foods?',
  'What should I pack for this trip?',
];

const ChatMessage = ({ message }) => (
  <motion.div
    className={`chat-message chat-message--${message.role}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    role={message.role === 'assistant' ? 'status' : undefined}
  >
    {message.role === 'assistant' && (
      <div className="chat-message__avatar" aria-hidden="true">✈</div>
    )}
    <div className="chat-message__bubble">
      <p className="chat-message__text">{message.content}</p>
      <span className="chat-message__time">
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  </motion.div>
);

const TypingIndicator = () => (
  <motion.div
    className="chat-message chat-message--assistant"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
  >
    <div className="chat-message__avatar" aria-hidden="true">✈</div>
    <div className="chat-message__bubble chat-message__bubble--typing" aria-label="AI is typing">
      <span /><span /><span />
    </div>
  </motion.div>
);

const ChatBot = ({ destination }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: `Hi! I'm your AI travel companion for ${destination.name}. Ask me anything — best time to visit, what to pack, how many days you need, or anything else about this amazing destination! 🌍`,
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || isLoading) return;

    setInput('');
    setError(null);

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const reply = await sendChatMessage(userText, destination, history);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: reply, timestamp: Date.now() },
      ]);
    } catch (err) {
      setError('Failed to get a response. Please check your API key and try again.');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="chatbot" aria-labelledby="chatbot-heading">
      <div className="chatbot__header">
        <div className="chatbot__avatar" aria-hidden="true">
          <span>✈</span>
          <div className="chatbot__avatar-dot" />
        </div>
        <div>
          <h2 id="chatbot-heading" className="chatbot__title">AI Travel Companion</h2>
          <p className="chatbot__subtitle">Ask me anything about {destination.name}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot__messages" role="log" aria-live="polite" aria-label="Chat messages">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <AnimatePresence>
          {isLoading && <TypingIndicator />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Error */}
      {error && (
        <div className="chatbot__error" role="alert">
          <span aria-hidden="true">⚠️</span>
          {error}
        </div>
      )}

      {/* Suggested questions */}
      {messages.length < 3 && (
        <div className="chatbot__suggestions" aria-label="Suggested questions">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              className="chatbot__suggestion"
              onClick={() => sendMessage(q)}
              disabled={isLoading}
              type="button"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form
        className="chatbot__input-row"
        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
        aria-label="Send a message"
      >
        <label htmlFor="chat-input" className="sr-only">Your question</label>
        <input
          id="chat-input"
          ref={inputRef}
          type="text"
          className="input chatbot__input"
          placeholder={`Ask about ${destination.name}...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          maxLength={500}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className="btn btn--primary chatbot__send"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          id="chat-send-btn"
        >
          {isLoading ? (
            <div className="spinner" style={{ width: 18, height: 18 }} />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"/>
            </svg>
          )}
        </button>
      </form>
    </section>
  );
};

export default ChatBot;
