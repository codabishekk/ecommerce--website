import React, { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import api from '../../services/api';
import ChatMessage from './ChatMessage';
import cleanMarkdown from '../../utils/cleanMarkdown';
import './AIChatWidget.css';

const WELCOME =
    "Hi! I am Sholash's AI support assistant. I can answer questions about our policies, find products, and help with your orders. How can I help you today?";

const QUICK_PROMPTS = [
    'What is your return policy?',
    'Show me products under ₹2000',
    'Where is my latest order?',
];

const AIChatWidget = ({ onAddToCart, onBuyClick, onLoginClick }) => {
    const { user, logout } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing, open]);

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([{ role: 'assistant', content: WELCOME, metadata: {} }]);
        }
    }, [open, messages.length]);

    const send = async (textOverride) => {
        const text = (textOverride ?? input).trim();
        if (!text || typing || !user) return;
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', content: text, metadata: {} }]);
        setTyping(true);

        try {
            const { data } = await api.post('/api/ai/chat', { message: text, conversationId });
            setConversationId(data.data.conversationId);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: cleanMarkdown(data.data.reply), metadata: data.data.metadata || {} },
            ]);
        } catch (err) {
            const msg =
                err.response?.status === 401
                    ? 'Your session has expired. Please log in again.'
                    : err.response?.data?.message ||
                      'AI support is temporarily unavailable. Please try again.';
            if (err.response?.status === 401) {
                logout();
            }
            setMessages((prev) => [...prev, { role: 'error', content: msg, metadata: {} }]);
        } finally {
            setTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    return (
        <>
            <button
                className="ai-float"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? 'Close AI support' : 'Open AI support'}
            >
                {open ? '✕' : '✦'}
            </button>

            {open && (
                <div className="ai-panel">
                    <div className="ai-header">
                        <div className="ai-header-title">
                            <span className="ai-avatar">✦</span>
                            <div>
                                <div className="ai-header-name">AI Support</div>
                                <div className="ai-header-sub">Sholash Life Science</div>
                            </div>
                        </div>
                        <button className="ai-close" onClick={() => setOpen(false)} aria-label="Close">
                            ✕
                        </button>
                    </div>

                    {!user ? (
                        <div className="ai-login-prompt">
                            <p>Please log in to use the AI support assistant.</p>
                            <button className="ai-btn ai-btn-primary" onClick={onLoginClick}>
                                Log In
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="ai-messages">
                                {messages.map((m, i) => (
                                    <ChatMessage
                                        key={i}
                                        message={m}
                                        onAddToCart={onAddToCart}
                                        onBuyClick={onBuyClick}
                                    />
                                ))}
                                {typing && (
                                    <div className="ai-msg ai-msg-bot">
                                        <div className="ai-typing">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                    </div>
                                )}
                                {messages.length === 1 && (
                                    <div className="ai-quick">
                                        {QUICK_PROMPTS.map((q) => (
                                            <button
                                                key={q}
                                                className="ai-chip"
                                                onClick={() => send(q)}
                                                disabled={typing}
                                            >
                                                {q}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            <div className="ai-input-bar">
                                <input
                                    className="ai-input"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message..."
                                    maxLength={2000}
                                    disabled={typing}
                                />
                                <button
                                    className="ai-send"
                                    onClick={() => send()}
                                    disabled={typing || !input.trim()}
                                    aria-label="Send"
                                >
                                    ➤
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default AIChatWidget;
