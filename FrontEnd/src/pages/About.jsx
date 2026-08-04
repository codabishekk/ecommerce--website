import React from 'react';
import './About.css';

// Using local assets if possible, falling back to high-quality unsplash for premium feel
import glazziumImg from '../assets/new images/main image.png';
import ceramoizImg from '../assets/new images/secondary image.png';

const About = () => {
    return (
        <div className="about-page">
            {/* Dynamic Background Blobs */}
            <div className="bg-blob blob-1"></div>
            <div className="bg-blob blob-2"></div>
            <div className="bg-blob blob-3"></div>

            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-decoration deco-1"></div>
                <div className="hero-decoration deco-2"></div>
                <div className="container">
                    <h1 className="serif fade-in">About Us</h1>
                </div>
            </section>

            {/* Pathway Section */}
            <section className="pathway-section fade-in">
                <div className="container pathway-grid">
                    <div className="pathway-content">
                        <span className="subtitle">Radiant Skin Science Exploration</span>
                        <h2 className="serif">The Pathway to Naturally Radiant, Healthy, and Glowing Skin</h2>

                        <div className="pathway-text">
                            <p>Sholash Life Sciences' Science of Glowing Skin investigates the intricate biological processes that contribute to a naturally radiant complexion.</p>
                            <p>Exploring the Science of Radiant, Healthy, and Naturally Glowing Skin for Lasting Beauty and Confidence.</p>
                        </div>

                        <ul className="pathway-list">
                            <li><span className="check">✓</span> The Science Behind Radiant Skin</li>
                            <li><span className="check">✓</span> Unveiling Skin's Natural Glow</li>
                            <li><span className="check">✓</span> Skin Health Through Science</li>
                            <li><span className="check">✓</span> The Secret to Glowing Skin</li>
                        </ul>

                        <p className="pathway-closing">Our research emphasizes the importance of proper skincare routines, balanced nutrition, and understanding skin physiology to achieve long-lasting results.</p>
                    </div>

                    <div className="pathway-visual">
                        <div className="glass-card image-card">
                            <img src={glazziumImg} alt="Glazzium" />
                            <div className="quote-box">
                                <span className="quote-icon">“</span>
                                <p>Sholash science of glowing skin explores the biological processes behind skin radiance, focusing on moisture retention, elasticity, and healthy circulation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solutions Section (Mission/Vision) */}
            <section className="solutions-section">
                <div className="container solutions-grid">
                    <div className="solutions-visual">
                        <img src={ceramoizImg} alt="Ceramoiz" className="featured-product" />
                    </div>

                    <div className="solutions-content">
                        <span className="subtitle">Healthy, Radiant, Glowing Skin</span>
                        <h2 className="serif text-gradient">Skincare Solutions for Radiance, Health, and Glow</h2>

                        <div className="solution-cards">
                            <div className="solution-card glass">
                                <div className="card-header">
                                    <div className="icon user-icon"></div>
                                    <h3 className="serif">Who We Are</h3>
                                </div>
                                <p>We create science-based skincare solutions for healthy, radiant, and naturally glowing skin.</p>
                            </div>

                            <div className="solution-card glass">
                                <div className="card-header">
                                    <div className="icon mission-icon"></div>
                                    <h3 className="serif">Our Mission</h3>
                                </div>
                                <p>To provide innovative, science-backed skincare solutions that nurture healthy, radiant, and glowing skin.</p>
                            </div>

                            <div className="solution-card glass">
                                <div className="card-header">
                                    <div className="icon promise-icon"></div>
                                    <h3 className="serif">Our Promise</h3>
                                </div>
                                <p>To nurture and protect your skin, providing effective solutions for lasting health and radiance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header text-center">
                        <h2 className="serif large-title">Great Customer Stories</h2>
                        <span className="subtitle">Our Products Are Our Customer</span>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card glass">
                            <p className="story">"Sholash Life Sciences has truly transformed my skin. It feels healthier, smoother, and glows with natural radiance!"</p>
                            <div className="user-profile">
                                <div className="avatar maria"></div>
                                <span className="name">Maria</span>
                            </div>
                        </div>

                        <div className="testimonial-card glass">
                            <p className="story">"Using Sholash Life Sciences has been a game-changer for my skin! It feels healthier, more radiant, and truly glowing!"</p>
                            <div className="user-profile">
                                <div className="avatar jenna"></div>
                                <span className="name">Jenna</span>
                            </div>
                        </div>

                        <div className="testimonial-card glass">
                            <p className="story">"Sholash Life Sciences has completely revitalized my skin. It's clearer, healthier, and naturally glowing. I highly recommend it!"</p>
                            <div className="user-profile">
                                <div className="avatar mark"></div>
                                <span className="name">Mark</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
