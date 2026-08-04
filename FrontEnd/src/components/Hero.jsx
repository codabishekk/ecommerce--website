import React from 'react';
import './Hero.css';

const Hero = () => {
    return (
        <section id="home" className="hero">
            <div className="container hero-content">
                <div className="hero-text fade-in">
                    <span className="subtitle">Luminous. Pure. Powerful.</span>
                    <h1 className="hero-title serif">Reveal Your <br />Natural Radiance</h1>
                    <p className="hero-description">
                        Scientifically formulated skincare designed to strengthen your skin barrier
                        and restore your inner glow. Experience the Sholash difference.
                    </p>
                    <div className="hero-cta">
                        <button className="btn btn-primary">Shop Collection</button>
                        <button className="btn btn-secondary">Our Philosophy</button>
                    </div>
                </div>
                <div className="hero-visual fade-in">
                    <div className="hero-image-placeholder glass">
                        <div className="abstract-shape"></div>
                        <div className="abstract-shape secondary"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
