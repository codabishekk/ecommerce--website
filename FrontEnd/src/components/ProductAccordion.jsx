import React, { useState } from 'react';
import './ProductAccordion.css';

const ProductAccordion = ({ product }) => {
    const [openSection, setOpenSection] = useState(null);
    const [openSubSection, setOpenSubSection] = useState('acne'); // Default open subsection

    const details = product?.details || {};

    const toggleSection = (sectionId) => {
        if (openSection === sectionId) {
            setOpenSection(null);
        } else {
            setOpenSection(sectionId);
            // Reset subsection to the first available one when switching main sections
            setOpenSubSection(details[sectionId]?.[0]?.id || null);
        }
    };

    const toggleSubSection = (subSectionId) => {
        setOpenSubSection(openSubSection === subSectionId ? null : subSectionId);
    };

    const sections = [
        { id: 'ingredients', title: 'Ingredients' },
        { id: 'benefits', title: 'Benefits' },
        { id: 'beforeAfter', title: 'Before/After' },
        { id: 'usage', title: 'Usage' },
        { id: 'other', title: 'Other Information' },
        // { id: 'legal', title: 'Legal Metrology' },
    ];

    const renderContent = (content, sectionId) => {
        const lines = String(content || '').split('\n').filter(line => line.trim());

        return lines.map((line, index) => {
            const trimmed = line.trim();

            if (sectionId === 'ingredients') {
                const match = trimmed.match(/^([•◦▪\-]?\s*)([^:]+:)(.*)$/);

                if (match) {
                    const [, bullet, label, description] = match;
                    return (
                        <p key={index}>
                            {bullet}
                            <strong>{label}</strong>
                            {description}
                        </p>
                    );
                }
            }

            return <p key={index}>{trimmed}</p>;
        });
    };

    return (
        <div className="product-accordion-wrapper">
            <div className="container">
                <div className="accordion-list">
                    {sections.map((section) => (
                        <div key={section.id} className="accordion-item">
                            <button
                                className={`accordion-header ${openSection === section.id ? 'active' : ''}`}
                                onClick={() => toggleSection(section.id)}
                            >
                                <span className="accordion-title serif">{section.title}</span>
                                <span className="accordion-icon">
                                    {openSection === section.id ? '−' : '+'}
                                </span>
                            </button>

                            {openSection === section.id && (
                                <div className="accordion-content fade-in">
                                    <div className="benefits-grid">
                                        <div className="benefits-image-wrapper">
                                            {product?.image ? (
                                                <img src={product.image} alt={product.name} className="benefits-image" />
                                            ) : (
                                                <div className="benefits-image-placeholder" style={{ backgroundColor: product?.color || '#eef3e6' }}></div>
                                            )}
                                        </div>
                                        <div className="benefits-sub-accordion">
                                            {details[section.id] && details[section.id].length > 0 ? (
                                                details[section.id].map((item) => (
                                                    <div key={item.id} className="sub-accordion-item">
                                                        <button
                                                            className="sub-accordion-header"
                                                            onClick={() => toggleSubSection(item.id)}
                                                        >
                                                            <span className="sub-accordion-title">{item.title}</span>
                                                            <span className="sub-accordion-icon">
                                                                {openSubSection === item.id ? '−' : '+'}
                                                            </span>
                                                        </button>
                                                        {openSubSection === item.id && (
                                                            <div className="sub-accordion-content fade-in">
                                                                {renderContent(item.content, section.id)}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="sub-accordion-content fade-in">
                                                    <p>Specific details for {section.title.toLowerCase()} are currently being updated.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductAccordion;
