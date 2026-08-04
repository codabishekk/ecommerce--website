import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import logo from '../assets/logo/logo_symbol.png';

const SplashScreen = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onComplete) {
                // Wait for the exit animation to finish
                setTimeout(onComplete, 1000);
            }
        }, 3000); // Slightly longer for premium feel

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`splash-screen ${isVisible ? 'visible' : 'exit'}`}>
            <div className="splash-content">
                <div className="splash-logo-container">
                    <img src={logo} alt="Sholash" className="splash-s-logo" />
                </div>
                
                <div className="splash-branding">
                    <h1 className="splash-brand-name">Sholash</h1>
                    <p className="splash-brand-tagline">The Science of Glowing Skin</p>
                </div>

                <div className="splash-loading">
                    <div className="splash-loader-line"></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
