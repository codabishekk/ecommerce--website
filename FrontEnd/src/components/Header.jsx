import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './Header.css';
import { Menu, X } from 'lucide-react';
import logo from '../assets/logo/logo.png';

const Header = ({ cartCount, searchQuery, setSearchQuery, onAuthClick }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(UserContext);
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const searchInputRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();

        const trimmedQuery = searchQuery.trim();

        // Mobile Expansion Logic
        if (window.innerWidth <= 768 && !isSearchExpanded) {
            setIsSearchExpanded(true);
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus();
                }
            }, 100);
            return;
        }

        // If query is empty, just scroll to products regardless
        const element = document.getElementById('products');
        
        if (location.pathname !== '/') {
            navigate('/#products');
            setTimeout(() => {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
        
        // Collapse search on mobile after submission
        if (window.innerWidth <= 768) {
            setIsSearchExpanded(false);
        }
    };

    return (
        <header className={`header glass fade-in ${scrolled ? 'scrolled' : ''}`}>
            <div className="container header-content">
                <button 
                    className="menu-toggle" 
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open Menu"
                >
                    <Menu size={24} />
                </button>
                <div className="logo">
                    <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        <img src={logo} alt="Sholash Life Sciences" className="logo-img" />
                    </Link>
                </div>
                <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(false)}></div>
                <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
                    <div className="nav-mobile-header">
                        <img src={logo} alt="Sholash Life Sciences" className="nav-mobile-logo" />
                        <button className="close-nav-btn" onClick={() => setIsMenuOpen(false)} aria-label="Close Menu">
                            <X size={24} />
                        </button>
                    </div>
                    <div className="nav-links">
                        <Link to="/" onClick={() => setIsMenuOpen(false)}>HOME</Link>
                        <a href="/#products" onClick={() => setIsMenuOpen(false)}>COLLECTION</a>
                        <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)}>CONTACT</Link>
                    </div>
                    <div className="nav-mobile-footer">
                        <p>Customer Support:<br/><strong>9800322201</strong></p>
                    </div>
                </nav>
                <div className="header-actions">
                    <form className={`search-container ${isSearchExpanded ? 'expanded' : ''}`} onSubmit={handleSearchSubmit}>
                        <input
                            ref={searchInputRef}
                            type="text"
                            className="search-input"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" className="icon-btn search-btn" aria-label="Search">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </form>
                    {user ? (
                        <Link to="/profile" className="account-user" title={user.name || 'Profile'} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                            <div className="icon-btn account-btn" aria-label="My Profile" style={{ background: '#f5f5f5', color: '#000' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <span className="account-text">{user.name?.split(' ')[0] || 'Profile'}</span>
                        </Link>
                    ) : (
                        <button className="icon-btn account-btn" onClick={onAuthClick} aria-label="Account">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span className="account-text">Account</span>
                        </button>
                    )}
                    <Link to="/cart" className="icon-btn cart-btn" aria-label="Cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                        <span className='account-text'>Cart</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
