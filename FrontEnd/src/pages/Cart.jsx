import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../services/api';
import './Cart.css';

const Cart = ({ cart, onUpdateQuantity, onRemoveFromCart }) => {
    const navigate = useNavigate();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const getImageUrl = (input) => {
        if (!input) return '';

        let img = '';

        if (typeof input === 'string') {
            img = input;
        } else if (Array.isArray(input) && input.length) {
            img = input[0];
        } else if (input.image) {
            img = input.image;
        } else if (input.images && Array.isArray(input.images) && input.images.length) {
            img = input.images[0];
        } else {
            return '';
        }

        if (!img) return '';
        if (img.startsWith('http')) return img;
        // normalize leading slash
        const normalized = img.startsWith('/') ? img : `/${img}`;
        // Use backend host for relative upload paths so cart images are served from API server
        return `${BASE_URL}${normalized}`;
    };

    return (
        <div className="cart-page fade-in">
            <div className="container">
                <header className="cart-header">
                    <h1 className="serif">Your Shopping Cart</h1>
                    <p className="subtitle">{cartCount} {cartCount === 1 ? 'Item' : 'Items'}</p>
                </header>

                {cart.length === 0 ? (
                    <div className="empty-cart fade-in">
                        <div className="empty-icon-container">
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        </div>
                        <h2 className="serif">Your cart is empty</h2>
                        <p>Discover our range of dermatologist-tested premium skincare.</p>
                        <Link to="/" className="btn-shopping">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items-list">
                            {cart.map((item) => (
                                <div key={item.id || item._id} className="cart-item glass fade-in">
                                    <div className="item-image-container">
                                        <img src={getImageUrl(item)} alt={item.name} className="item-img" />
                                    </div>
                                    <div className="item-details">
                                        <span className="item-category">
                                            {typeof item.category === 'object' ? item.category.name : item.category}
                                        </span>
                                        <h3 className="serif">{item.name}</h3>
                                        <div className="item-price">₹{item.price}</div>
                                    </div>
                                    <div className="item-actions">
                                        <div className="cart-quantity-selector">
                                            <button onClick={() => onUpdateQuantity(item.id || item._id, item.quantity - 1)}>−</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => onUpdateQuantity(item.id || item._id, item.quantity + 1)}>+</button>
                                        </div>
                                        <button className="btn-remove" onClick={() => onRemoveFromCart(item.id || item._id)}>
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <aside className="cart-summary glass sticky">
                            <h2 className="serif">Order Summary</h2>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>₹{total}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="free">FREE</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total</span>
                                    <span>₹{total}</span>
                                </div>
                            </div>
                            <button className="btn-checkout" onClick={() => navigate('/payment')}>
                                Secure Checkout
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '10px' }}><path d="M5 12h14m-7-7 7 7-7 7"></path></svg>
                            </button>
                            
                            <div className="trust-badges-mini">
                                <div className="trust-badge-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                                    <span>Secure Payment</span>
                                </div>
                                <div className="trust-badge-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                                    <span>100% Satisfaction</span>
                                </div>
                            </div>
                            
                            <Link to="/" className="continue-shopping">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 12H5m7 7-7-7 7-7"></path></svg>
                                Continue Shopping
                            </Link>
                        </aside>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
