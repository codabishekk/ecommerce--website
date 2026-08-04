import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './Profile.css';

const Profile = () => {
    const { user, login, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const fileInputRef = useRef(null);

    // Redirect to home if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Update global user context with new profile picture
                login({ ...user, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="profile-page fade-in">
            <div className="profile-container container">
                
                {/* ─── Sidebar ────────────────────────────────────────── */}
                <aside className="profile-sidebar glass-panel">
                    <div className="profile-header">
                        <div className="profile-avatar-wrapper">
                            <div className="profile-avatar">
                                {user.profilePic ? (
                                    <img src={user.profilePic} alt="Profile" />
                                ) : (
                                    <span>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                )}
                            </div>
                            <button 
                                className="edit-avatar-btn" 
                                aria-label="Edit Profile Picture"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <h2 className="profile-name serif">{user.name || 'User'}</h2>
                        <p className="profile-contact">{user.contact}</p>
                    </div>
                    
                    <nav className="profile-nav">
                        <button 
                            className={`profile-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setActiveTab('dashboard')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            Dashboard
                        </button>
                        <button 
                            className={`profile-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                            My Orders
                        </button>
                        <button 
                            className={`profile-nav-btn ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Settings
                        </button>
                        <a href="tel:9500522551" className="profile-nav-btn support-link">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            Support
                        </a>
                    </nav>

                    <button className="profile-logout-btn" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                        Log Out
                    </button>
                </aside>

                {/* ─── Main Content Area ──────────────────────────────── */}
                <main className="profile-content">
                    
                    {activeTab === 'dashboard' && (
                        <div className="tab-pane fade-in">
                            <h2 className="serif pane-title">Welcome Back, {user.name?.split(' ')[0] || 'User'}!</h2>
                            <p className="pane-subtitle">Dermatologist-tested skincare specially curated for you.</p>
                            
                            <div className="dashboard-grid">
                                <div className="dash-card">
                                    <div className="dash-icon-wrapper">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path></svg>
                                    </div>
                                    <div className="dash-info">
                                        <h3>Total Orders</h3>
                                        <p className="dash-value">0</p>
                                    </div>
                                </div>
                                <div className="dash-card clickable" onClick={() => navigate('/cart')}>
                                    <div className="dash-icon-wrapper">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                    </div>
                                    <div className="dash-info">
                                        <h3>Cart Items</h3>
                                        <p className="dash-value">View Cart</p>
                                    </div>
                                </div>
                                <div className="dash-card clickable" onClick={() => navigate('/#products')}>
                                    <div className="dash-icon-wrapper">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path><path d="M5 3v4"></path><path d="M19 17v4"></path><path d="M3 5h4"></path><path d="M17 19h4"></path></svg>
                                    </div>
                                    <div className="dash-info">
                                        <h3>Discover</h3>
                                        <p className="dash-value">Shop Now</p>
                                    </div>
                                </div>
                            </div>

                            <div className="account-details-box glass-panel">
                                <div className="box-header">
                                    <h3 className="serif">Personal Information</h3>
                                    <button className="text-btn" onClick={() => setActiveTab('settings')}>Edit</button>
                                </div>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Full Name</span>
                                        <span className="info-value">{user.name || 'Not provided'}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Email / Phone</span>
                                        <span className="info-value">{user.contact}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Account Status</span>
                                        <span className="info-value status-active">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="tab-pane fade-in">
                            <h2 className="serif pane-title">Order History</h2>
                            <p className="pane-subtitle">You have no recent orders.</p>
                            
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"><path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"></path><path d="M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3"></path><path d="M4 12H2"></path><path d="M10 12H7"></path><path d="M17 12h-3"></path><path d="M22 12h-2"></path></svg>
                                </div>
                                <h3>No orders yet</h3>
                                <p>Looks like you haven't made your first purchase yet. Discover our scientific skincare collection.</p>
                                <button className="auth-btn-primary" onClick={() => navigate('/#products')} style={{ width: 'auto', padding: '12px 30px', marginTop: '15px' }}>
                                    Browse Products
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="tab-pane fade-in">
                            <h2 className="serif pane-title">Account Settings</h2>
                            <p className="pane-subtitle">Update your personal information and preferences.</p>
                            
                            <form className="settings-form glass-panel" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" defaultValue={user.name} className="auth-input" />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" defaultValue={user.contact.includes('@') ? user.contact : ''} className="auth-input" disabled />
                                    <span className="help-text">Email cannot be changed after verification.</span>
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" defaultValue={!user.contact.includes('@') ? user.contact : ''} className="auth-input" placeholder="Add phone number" />
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="auth-btn-primary" style={{ width: 'auto', padding: '12px 30px' }} onClick={() => setActiveTab('dashboard')}>
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default Profile;
