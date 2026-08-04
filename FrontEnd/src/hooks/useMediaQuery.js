import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if a media query matches.
 * @param {string} query - Media query (e.g., '(max-width: 768px)')
 * @returns {boolean} - True if the query matches
 */
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        
        // Initial check
        setMatches(media.matches);
        
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
};

export default useMediaQuery;
