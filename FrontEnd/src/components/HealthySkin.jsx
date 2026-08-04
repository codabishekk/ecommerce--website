import React from 'react';
import './HealthySkin.css';

import healthyskin from '../assets/home img/imgs.png';
import aboutImg1 from '../assets/ICONS/clean-water.png';
import aboutImg2 from '../assets/ICONS/skin-tone.png';
import aboutImg3 from '../assets/ICONS/day-and-night.png';
import aboutImg4 from '../assets/ICONS/exfoliant.png';

const features = [
    {
        id: 1,
        title: "Hydration",
        description: "Maintains moisture balance, preventing dryness, flakiness, and irritation for smooth, supple skin.",
        icon: (
            <img src={aboutImg1} alt="Hydration" />
        )
    },
    {
        id: 2,
        title: "Nutrition",
        description: "Supports skin repair, elasticity, and glow with essential vitamins and minerals.",
        icon: (
            <img src={aboutImg2} alt="Nutrition" />
        )
    },
    {
        id: 3,
        title: "Protection",
        description: "Shields against UV rays, pollution, and harmful environmental factors, maintaining skin health.",
        icon: (
            <img src={aboutImg3} alt="protection" />
        )
    },
    {
        id: 4,
        title: "Exfoliation",
        description: "Removes dead cells, promoting cell turnover for a fresh, radiant complexion.",
        icon: (
            <img src={aboutImg4} alt="exfoliation" />
        )
    }
];

const HealthySkin = () => {
    return (
        <section className="healthy-skin-section">
            <div className="container healthy-skin-container">
                <div className="healthy-skin-content fade-in">
                    <h2 className="serif">Healthy skin</h2>
                    <p className="main-description">
                        Healthy skin is well-hydrated, smooth, evenly toned, resilient, free from
                        irritation or blemishes, and has a natural, radiant glow.
                    </p>

                    <div className="features-grid">
                        {features.map(feature => (
                            <div key={feature.id} className="feature-item">
                                <div className="feature-icon">
                                    {feature.icon}
                                </div>
                                <div className="feature-text">
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="healthy-skin-visual fade-in">
                    <div className="trendy-image-wrapper">
                        <img
                            src={healthyskin} alt="Healthy Radiant Skin"
                            className="healthy-skin-image"
                        />
                        <div className="color-blob"></div>
                        <div className="color-blob secondary"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HealthySkin;
