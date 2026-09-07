import React from 'react';
import './ProtectionSection.css';
import protection from "../assets/home img/img2 (2).png";
import aboutImg1 from '../assets/ICONS/cream.png';
import aboutImg2 from '../assets/ICONS/moistuirizing.png';
import aboutImg3 from '../assets/ICONS/uv.png';
import aboutImg4 from '../assets/ICONS/cosmetics.png';

const protectionCategories = [
    {
        id: 1,
        title: "Emulsion Creams",
        description: "Semi-solid mixtures of oil & water (O/W or W/O), used for topical drug delivery or skin hydration.",
        icon: (
            <img src={aboutImg1} alt="Emulsion Creams" />
        )
    },
    {
        id: 2,
        title: "Medicated Creams",
        description: "Contain active drugs (e.g., steroids, antibiotics) to treat skin conditions like eczema, infections, or inflammation.",
        icon: (
            <img src={aboutImg2} alt="Medicated Creams" />
        )
    },
    {
        id: 3,
        title: "Protective Creams",
        description: "Barrier creams (e.g., zinc oxide) that shield skin from moisture, irritants, or diaper rash.",
        icon: (
            <img src={aboutImg3} alt="Protective Creams" />
        )
    },
    {
        id: 4,
        title: "Cosmetic Creams",
        description: "Non-medicated (e.g., moisturizers) for hydration, anti-aging, or improving skin texture without therapeutic effects.",
        icon: (
            <img src={aboutImg4} alt="Cosmetic Creams" />
        )
    }
];

const ProtectionSection = () => {
    return (
        <section className="protection-section">
            <div className="container protection-container">
                <div className="protection-visual fade-in">
                    <div className="protection-image-wrapper">
                        <img
                            src={protection} alt="Diverse Healthy Skin"
                            className="protection-image"
                        />
                        <div className="protection-blob"></div>
                        <div className="protection-blob secondary"></div>
                    </div>
                </div>

                <div className="protection-content fade-in">
                    <h2 className="serif">Oil Skin Protection</h2>
                    <p className="protection-description">
                        Oil skin protection creates a barrier that locks in moisture, prevents
                        dryness, and shields against environmental damage, maintaining
                        healthy skin.
                    </p>

                    <div className="protection-grid">
                        {protectionCategories.map(item => (
                            <div key={item.id} className="protection-item">
                                <div className="protection-icon">
                                    {item.icon}
                                </div>
                                <div className="protection-text">
                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProtectionSection;
