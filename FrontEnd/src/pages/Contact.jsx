import React, { useState } from 'react';
import './Contact.css';
import Allproducts from '../assets/new images/all product.png';

const Contact = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
        setFormData({ firstName: '', email: '', phone: '', message: '' });
    };

    return (
        <div className="contact-page">
            {/* Dynamic Background Blobs */}
            <div className="bg-blob blob-mint"></div>
            <div className="bg-blob blob-lilac"></div>
            <div className="bg-blob blob-sky"></div>

            {/* Hero Section */}
            <section className="contact-hero">
                <div className="hero-decoration deco-1"></div>
                <div className="hero-decoration deco-2"></div>
                <div className="container">
                    <h1 className="serif fade-in">Contact Us</h1>
                </div>
            </section>

            {/* Main Contact Grid */}
            <section className="contact-grid-section">
                <div className="container contact-main-grid">
                    <div className="contact-visual fade-in">
                        <div className="glass-card product-showcase">
                            <img src={Allproducts} alt="Ceramoiz Product" />
                            <div className="visual-badge">Premium Care</div>
                        </div>
                    </div>

                    <div className="contact-form-container fade-in">
                        <span className="subtitle">Get In Touch</span>
                        <h2 className="serif">Any Question? <br />Write Down And Send Us</h2>

                        {isSubmitted ? (
                            <div className="form-success-message glass fade-in">
                                <div className="success-icon">✓</div>
                                <h3>Message Sent!</h3>
                                <p>Thank you for reaching out. Our team will get back to you shortly.</p>
                                <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>Send Another</button>
                            </div>
                        ) : (
                            <form className="premium-form" onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        name="firstName"
                                        placeholder="First Name"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <textarea
                                        name="message"
                                        placeholder="Enter your message..."
                                        rows="5"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn-send">Send Message</button>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            {/* Info Cards Section */}
            <section className="info-cards-section">
                <div className="container info-grid">
                    <div className="info-card glass">
                        <div className="info-header">
                            <div className="info-icon office-icon"></div>
                            <h3 className="serif">Main Office</h3>
                        </div>
                        <div className="info-body">
                            <p><strong>Sholash Life Sciences</strong></p>
                            <p>First Floor, D.No-2/2, Kilamel Street II , <br />
                                Lakshmipuram, Ganapathy Post, <br />
                                Coimbatore -641006.</p>
                        </div>
                    </div>

                    <div className="info-card glass">
                        <div className="info-header">
                            <div className="info-icon phone-icon"></div>
                            <h3 className="serif">Make a Call</h3>
                        </div>
                        <div className="info-body">
                            <a href="tel:9500522551" className="info-link">9500522551</a>
                        </div>
                    </div>

                    <div className="info-card glass">
                        <div className="info-header">
                            <div className="info-icon mail-icon"></div>
                            <h3 className="serif">Send a Mail</h3>
                        </div>
                        <div className="info-body">
                            <a href="mailto:sholashlifesciences@gmail.com" className="info-link">sholashlifesciences@gmail.com</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
                <div className="container">
                    <div className="map-wrapper glass">
                        <iframe
                            src="https://www.google.com/maps?q=Sholash+Life+Sciences,+Coimbatore&output=embed"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Sholash Life Sciences Location"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
