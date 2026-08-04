import React from 'react';
import './BrandSection.css';
import mainImage from '../assets/new images/main image.png';
import mobileImage from '../assets/home img/img3.png';
import secondaryImage from '../assets/new images/secondary image.png';
import icons1 from '../assets/ICONS/atom.png';
import icons2 from '../assets/ICONS/soap.png';
import icons3 from '../assets/ICONS/flask.png';

const BrandSection = () => {
    return (
        <section className="brand-section">
            <div className="container brand-grid">
                <div className="brand-visual">
                    <div className="image-stack">
                        <div className="main-image">
                            <picture>
                                <source srcSet={mobileImage} media="(max-width: 768px)" />
                                <img src={mainImage} alt="Scientific Skincare" />
                            </picture>
                        </div>
                        <div className="secondary-image floating-anim">
                            <img src={secondaryImage} alt="Product Purity" />
                        </div>
                    </div>
                </div>

                <div className="brand-content">
                    <span className="brand-badge accent-font">Our Legacy & Science</span>
                    <h2 className="brand-title serif">Science-Backed <span className="text-gradient">Skincare For</span>Real Results</h2>
                    <p className="brand-desc">
                        At Sholash Life Sciences, we combine advanced dermatological research with carefully selected ingredients to create skincare that delivers visible, lasting results.
                        Engineered to restore balance, enhance clarity, and support your skin’s  strength.
                    </p>

                    <div className="features-grid">
                        <div className="feature-item">
                            <div className="feature-icon science-icon">
                                <img src={icons1} alt="Science-Driven Care" />

                            </div>
                            <div className="feature-text">
                                <h4 className="serif">Science-Driven Care</h4>
                                <p>Formulated with clinically studied ingredients to improve hydration, texture, and skin resilience.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon purity-icon">
                                <img src={icons2} alt="Dermatologist-Tested Safety" />
                            </div>
                            <div className="feature-text">
                                <h4 className="serif">Dermatologist-Tested Safety</h4>
                                <p>Protecting your skin with dermatologically tested formulas.Gentle, effective, and suitable for sensitive and acne-prone skin.</p>
                            </div>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon result-icon">
                                <img src={icons3} alt="Lasting Results" />
                            </div>
                            <div className="feature-text">
                                <h4 className="serif">Lasting Results</h4>
                                <p>Designed to deliver real improvements in skin clarity, smoothness, and overall health.</p>
                            </div>
                        </div>
                    </div>

                    <div className="brand-actions">
                        <button className="btn-primary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                            Explore Products
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BrandSection;
