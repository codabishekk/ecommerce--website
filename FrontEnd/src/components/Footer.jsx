import React, { useState } from 'react';
import './Footer.css';
import logo from '../assets/logo/logo.png';

const Footer = () => {
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            setIsSubscribed(true);
            setEmail('');
        }
    };

    return (
        <footer className="footer fade-in">
            <div className="container footer-content">
                <div className="footer-brand">
                    <div className="logo">
                        <img src={logo} alt="Sholash Life Sciences" className="logo-img" />
                    </div>
                    <p>Sholash Life Sciences is dedicated to advancing health through innovative research, quality products, and a commitment to scientific excellence.</p>
                </div>
                <div className="footer-links">
                    <div className="link-group">
                        <h4>Shop</h4>
                        <a href="#">Sunscreen</a>
                        <a href="#">Moisturizers</a>
                        <a href="#">Cleansers</a>
                        <a href="#">Treatments</a>
                    </div>
                    <div className="link-group">
                        <h4>Support</h4>
                        <a href="#">Shipping</a>
                        <a href="#">Returns</a>
                        <a href="#">Contact Us</a>
                        <a href="#">FAQ</a>
                    </div>
                    <div className="link-group">
                        <h4>Newsletter</h4>
                        <p>Join our community for skin tips and early access.</p>
                        {isSubscribed ? (
                            <div className="newsletter-success fade-in">
                                <p>Thank you for subscribing!</p>
                            </div>
                        ) : (
                            <form className="newsletter-form" onSubmit={handleSubmit}>
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button className="button" type="submit">Join</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 SHOLASH DEVELOPED BY AIM UNIVERSSE</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
