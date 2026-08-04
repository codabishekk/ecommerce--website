import React, { useState, useContext, useEffect } from 'react';
import { Save, Bell, Palette, User, Shield, Info } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import styles from './SettingsPage.module.css';
import axios from 'axios';

const SettingsPage = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { adminUser } = useAdminAuth();
    
    const [profile, setProfile] = useState({
        name: adminUser?.name || '',
        email: adminUser?.email || '',
        role: adminUser?.role || 'Superadmin'
    });

    const [notifications, setNotifications] = useState({
        newOrderAlerts: true,
        lowStockWarning: true,
        customerReviews: false,
        weeklyReports: true
    });

    const [appearance, setAppearance] = useState({
        darkMode: theme === 'dark',
        floatingAnimations: true,
        compactSidebar: false
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (adminUser) {
            setProfile({
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            });
        }
        fetchSettings();
    }, [adminUser]);

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('sholash_admin_token');
            const res = await axios.get('/api/admin/settings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success && Array.isArray(res.data.data)) {
                const settingsArray = res.data.data;
                const newNotifs = { ...notifications };
                const newApp = { ...appearance };
                
                settingsArray.forEach(s => {
                    if (s.group === 'notifications' && newNotifs.hasOwnProperty(s.key)) {
                        newNotifs[s.key] = s.value;
                    } else if (s.group === 'appearance' && newApp.hasOwnProperty(s.key)) {
                        newApp[s.key] = s.value;
                    }
                });
                
                setNotifications(newNotifs);
                setAppearance(newApp);
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
        }
    };

    const saveSetting = async (key, value, group) => {
        try {
            const token = localStorage.getItem('sholash_admin_token');
            await axios.put('/api/admin/settings', {
                settings: [{ key, value, group }]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error(`Failed to save setting ${key}`, error);
            setMessage({ type: 'error', text: `Failed to save ${key}. Please try again.` });
        }
    };

    const handleProfileChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleToggleNotification = (key) => {
        const newValue = !notifications[key];
        setNotifications({ ...notifications, [key]: newValue });
        saveSetting(key, newValue, 'notifications');
    };

    const handleToggleAppearance = (key) => {
        const newValue = !appearance[key];
        if (key === 'darkMode') {
            toggleTheme();
        }
        setAppearance({ ...appearance, [key]: newValue });
        saveSetting(key, newValue, 'appearance');
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        try {
            const token = localStorage.getItem('sholash_admin_token');
            const res = await axios.put('/api/admin/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setMessage({ type: 'success', text: 'Profile updated successfully!' });
                // Update local storage so changes persist on refresh
                localStorage.setItem('sholash_admin_user', JSON.stringify(res.data.data));
                // Optional: In a full implementation, you'd trigger a context refresh here
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h2>Settings</h2>
                    <p>Configure your admin preferences.</p>
                </div>
            </div>

            {message.text && (
                <div className={`${styles.alert} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            <div className={styles.grid}>
                {/* Profile Settings */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <User size={20} />
                        <h3>Profile Settings</h3>
                    </div>
                    <form className={styles.form} onSubmit={handleSaveProfile}>
                        <div className={styles.inputGroup}>
                            <label htmlFor="name">Full Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name"
                                value={profile.name} 
                                onChange={handleProfileChange}
                                placeholder="Admin Developer"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email Address</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email"
                                value={profile.email} 
                                onChange={handleProfileChange}
                                placeholder="admin@sholash.com"
                            />
                        </div>
                        <div className={styles.inputGroup}>
                            <label htmlFor="role">Role</label>
                            <input 
                                type="text" 
                                id="role" 
                                value={profile.role} 
                                disabled 
                                className={styles.disabledInput}
                            />
                        </div>
                        <button type="submit" className={styles.saveBtn} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </section>

                {/* Notifications */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Bell size={20} />
                        <h3>Notifications</h3>
                    </div>
                    <div className={styles.toggleList}>
                        <div className={styles.toggleItem}>
                            <span>New Order Alerts</span>
                            <button 
                                className={`${styles.toggle} ${notifications.newOrderAlerts ? styles.active : ''}`}
                                onClick={() => handleToggleNotification('newOrderAlerts')}
                            >
                                <div className={styles.thumb}></div>
                            </button>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Low Stock Warning</span>
                            <button 
                                className={`${styles.toggle} ${notifications.lowStockWarning ? styles.active : ''}`}
                                onClick={() => handleToggleNotification('lowStockWarning')}
                            >
                                <div className={styles.thumb}></div>
                            </button>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Customer Reviews</span>
                            <button 
                                className={`${styles.toggle} ${notifications.customerReviews ? styles.active : ''}`}
                                onClick={() => handleToggleNotification('customerReviews')}
                            >
                                <div className={styles.thumb}></div>
                            </button>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Weekly Reports</span>
                            <button 
                                className={`${styles.toggle} ${notifications.weeklyReports ? styles.active : ''}`}
                                onClick={() => handleToggleNotification('weeklyReports')}
                            >
                                <div className={styles.thumb}></div>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Appearance */}
                <section className={styles.card}>
                    <div className={styles.cardHeader}>
                        <Palette size={20} />
                        <h3>Appearance</h3>
                    </div>
                    <div className={styles.toggleList}>
                        <div className={styles.toggleItem}>
                            <span>Dark Mode</span>
                            <button 
                                className={`${styles.toggle} ${appearance.darkMode ? styles.active : ''}`}
                                onClick={() => handleToggleAppearance('darkMode')}
                            >
                                <div className={styles.thumb}></div>
                            </button>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Floating Animations</span>
                            <button 
                                className={`${styles.toggle} ${appearance.floatingAnimations ? styles.active : ''}`}
                                onClick={() => handleToggleAppearance('floatingAnimations')}
                            >
                                <div className={styles.thumb}></div>
                            </button>
                        </div>
                        <div className={styles.toggleItem}>
                            <span>Compact Sidebar</span>
                            <button 
                                className={`${styles.toggle} ${appearance.compactSidebar ? styles.active : ''}`}
                                onClick={() => handleToggleAppearance('compactSidebar')}
                            >
                                <div className={styles.thumb}></div>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
