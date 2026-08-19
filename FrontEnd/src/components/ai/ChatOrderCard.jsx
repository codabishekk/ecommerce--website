import React from 'react';
import { Link } from 'react-router-dom';

const shortId = (id) => String(id || '').slice(-6).toUpperCase();

const ChatOrderCard = ({ order }) => {
    if (!order) return null;
    return (
        <div className="ai-order-card">
            <div className="ai-order-top">
                <span className="ai-order-id">Order #{shortId(order.id)}</span>
                <span className={`ai-order-status ${order.orderStatus || ''}`}>
                    {order.orderStatus || '—'}
                </span>
            </div>
            <div className="ai-order-body">
                <div className="ai-order-items">
                    {order.items && order.items.length > 0
                        ? order.items.map((it, i) => (
                              <div key={i} className="ai-order-item">
                                  <span className="ai-order-item-name">{it.name}</span>
                                  <span className="ai-order-item-qty">× {it.qty}</span>
                              </div>
                          ))
                        : 'No items'}
                </div>
                <div className="ai-order-total">₹{order.totalPrice}</div>
            </div>
            <div className="ai-order-meta">
                Payment: {order.paymentStatus} · {order.paymentMethod || 'N/A'}
                {order.createdAt ? ` · ${new Date(order.createdAt).toLocaleDateString()}` : ''}
            </div>
            <Link to="/profile" className="ai-order-view">View Order</Link>
        </div>
    );
};

export default ChatOrderCard;
