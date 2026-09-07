import React from 'react';
import './SkinTypes.css';
import organicIcon1 from '../assets/ICONS/skin-protection.png';
import organicIcon2 from '../assets/ICONS/oily.png';
import organicIcon3 from '../assets/ICONS/skin-regeneration.png';
import organicIcon4 from '../assets/ICONS/facial-hair.png';
const skinTypes = [
    {
        id: 1,
        title: "Normal Skin",
        description: "Normal skin is well-balanced, neither too oily nor too dry, with a smooth texture, minimal blemishes, and healthy elasticity.",
        icon: (
            <img src={organicIcon1} alt="Normal Skin" />
        )
    },
    {
        id: 2,
        title: "Oily Skin",
        description: "Oily skin produces excess sebum, leading to a shiny appearance, enlarged pores, and a higher risk of acne breakouts.",
        icon: (
            <img src={organicIcon2} alt="Oily Skin" />
        )
    },
    {
        id: 3,
        title: "Sensitive Skin",
        description: "Sensitive skin is easily irritated, prone to redness, dryness, and reactions to environmental factors or products.",
        icon: (
           <img src={organicIcon3} alt="Sensitive Skin" />
        )
    },
    {
        id: 4,
        title: "Acne-Prone Skin",
        description: "Acne-prone skin requires gentle care, non-comedogenic products, and calming ingredients to prevent breakouts and irritation.",
        icon: (
            <img src={organicIcon4} alt="Acne-Prone Skin" />
        )
    }
];

const SkinTypes = () => {
    return (
        <section className="skin-types-section fade-in">
            <div className="container">
                <div className="skin-types-grid">
                    {skinTypes.map(type => (
                        <div key={type.id} className="skin-type-card">
                            <div className="skin-type-icon">
                                {type.icon}

                            </div>
                            <h3 className="serif">{type.title}</h3>
                            <p>{type.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SkinTypes;
