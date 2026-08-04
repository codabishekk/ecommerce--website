import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PaymentProcess.css';

const PaymentProcess = ({ cart, clearCart }) => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState('card');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zip: ''
    });

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const getImageUrl = (img) => {
        if (!img) return '';
        if (img.startsWith('http')) return img;
        if (img.startsWith('/')) return img;
        return `/${img}`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            // clearCart(); // Optimization: clear cart after success
        }, 2000);
    };

    if (isSuccess) {
        return (
            <div className="payment-page fade-in">
                <div className="container">
                    <div className="success-container glass">
                        <div className="success-circle pulse">✓</div>
                        <h2 className="serif">Order Placed Successfully!</h2>
                        <p>Thank you for your purchase. We've received your order and are processing it. You'll receive a confirmation email shortly.</p>
                        <div className="order-details glass-card">
                            <p><strong>Order ID:</strong> #SHL-{Math.floor(Math.random() * 100000)}</p>
                            <p><strong>Total Amount:</strong> ₹{total}</p>
                        </div>
                        <Link to="/" className="btn-primary" style={{ marginTop: '2rem' }}>Continue Shopping</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0 && !isSuccess) {
        return (
            <div className="payment-page">
                <div className="container text-center">
                    <div className="section-card glass" style={{ padding: '4rem' }}>
                        <h2 className="serif">Your cart is empty</h2>
                        <p>Please add some products to your cart before proceeding to checkout.</p>
                        <Link to="/" className="btn-primary" style={{ marginTop: '2rem' }}>Browse Products</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page fade-in">
            <div className="container payment-container">
                <div className="payment-title">
                    <h1 className="serif">Checkout</h1>
                    <p className="subtitle">Secure Payment Portal</p>
                </div>

                <div className="payment-form-section">
                    <form id="checkout-form" onSubmit={handleSubmit}>
                        <div className="section-card glass fade-in">
                            <h2 className="serif">
                                <span className="step-number">1</span> Shipping Details
                            </h2>
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        required
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <input
                                        type="text"
                                        name="address"
                                        placeholder="Delivery Address"
                                        required
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="City"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="zip"
                                        placeholder="ZIP / Postal Code"
                                        required
                                        value={formData.zip}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="section-card glass fade-in" style={{ marginTop: '2rem' }}>
                            <h2 className="serif">
                                <span className="step-number">2</span> Payment Method
                            </h2>
                            <div className="payment-methods">
                                <div
                                    className={`payment-method-option ${selectedMethod === 'card' ? 'selected' : ''}`}
                                    onClick={() => setSelectedMethod('card')}
                                >
                                    <div className="method-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>
                                    </div>
                                    <div className="method-info">
                                        <span>Credit / Debit Card</span>
                                        <small>Visa, Mastercard, AMEX</small>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method-option ${selectedMethod === 'upi' ? 'selected' : ''}`}
                                    onClick={() => setSelectedMethod('upi')}
                                >
                                    <div className="method-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                                    </div>
                                    <div className="method-info">
                                        <span>UPI / Google Pay</span>
                                        <small>Fast & Secure</small>
                                    </div>
                                </div>
                                <div
                                    className={`payment-method-option ${selectedMethod === 'cod' ? 'selected' : ''}`}
                                    onClick={() => setSelectedMethod('cod')}
                                >
                                    <div className="method-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                    </div>
                                    <div className="method-info">
                                        <span>Cash on Delivery</span>
                                        <small>Pay when you receive</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <aside className="order-summary-sidebar">
                    <div className="section-card glass sticky fade-in">
                        <h2 className="serif">Order Summary</h2>
                        <div className="summary-items">
                            {cart.map(item => (
                                <div key={item.id || item._id} className="summary-item">
                                    <div className="summary-item-image">
                                        <img src={getImageUrl(item.image)} alt={item.name} className="item-img-mini" />
                                    </div>
                                    <div className="summary-item-info">
                                        <span className="item-cat-mini">
                                            {typeof item.category === 'object' ? item.category.name : item.category}
                                        </span>
                                        <h4>{item.name}</h4>
                                        <p>Qty: {item.quantity}</p>
                                    </div>
                                    <div className="summary-item-price">
                                        ₹{item.price * item.quantity}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="summary-totals">
                            <div className="total-row">
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            <div className="total-row">
                                <span>Shipping</span>
                                <span className="free">FREE</span>
                            </div>
                            <div className="total-row grand-total">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            form="checkout-form"
                            className="btn-place-order"
                            disabled={isProcessing}
                        >
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default PaymentProcess;
