import React from 'react';
import ChatProductResults from './ChatProductResults';
import ChatOrderCard from './ChatOrderCard';
import ChatConfirm from './ChatConfirm';

const ChatMessage = ({ message, onAddToCart, onBuyClick }) => {
    if (!message) return null;

    if (message.role === 'error') {
        return <div className="ai-msg ai-msg-error">{message.content}</div>;
    }

    const metadata = message.metadata || {};
    const isUser = message.role === 'user';

    return (
        <div className={`ai-msg ${isUser ? 'ai-msg-user' : 'ai-msg-bot'}`}>
            {!isUser && <div className="ai-bot-avatar">✦</div>}
            <div className="ai-msg-content">
                {message.content && <div className="ai-msg-text">{message.content}</div>}

                {metadata.products && metadata.products.length > 0 && (
                    <ChatProductResults products={metadata.products} onAddToCart={onAddToCart} onBuyClick={onBuyClick} />
                )}

                {metadata.order && <ChatOrderCard order={metadata.order} />}

                {metadata.orders && metadata.orders.length > 0 && (
                    <div className="ai-orders">
                        {metadata.orders.map((o) => (
                            <ChatOrderCard key={o.id} order={o} />
                        ))}
                    </div>
                )}

                {metadata.orderStatus && (
                    <div className="ai-status-chip">
                        Order status: <strong>{metadata.orderStatus.orderStatus}</strong> · Payment:{' '}
                        {metadata.orderStatus.paymentStatus}
                    </div>
                )}

                {metadata.action_request && (
                    <ChatConfirm actionRequest={metadata.action_request} />
                )}

                {metadata.ticket && <div className="ai-ticket-note">A human agent has been notified.</div>}
            </div>
        </div>
    );
};

export default ChatMessage;
