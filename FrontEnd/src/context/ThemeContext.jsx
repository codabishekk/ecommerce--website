import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference on load
    const [theme, setTheme] = useState(() => {
        const storedTheme = localStorage.getItem('sholash-admin-theme');
        if (storedTheme) return storedTheme;
        
        // Default to dark if system is dark (optional, commented out for now to default to light)
        // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
        
        return 'light'; // Default to light mode as per screenshot
    });

    useEffect(() => {
        // Update root element attribute for CSS targeted styling
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sholash-admin-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
