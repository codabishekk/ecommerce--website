import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search, Bell, MessageSquare, Moon, Sun, LogOut, Package, ShoppingCart, User, X } from 'lucide-react';
import axios from 'axios';
import { ThemeContext } from '../../../context/ThemeContext';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import styles from './Topbar.module.css';

const Topbar = ({ toggleSidebar }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const { logoutAdmin, adminUser, token } = useAdminAuth();
    
    const dropdownRef = useRef(null);
    const messagesDropdownRef = useRef(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const [showMessages, setShowMessages] = useState(false);
    const [messages, setMessages] = useState([]);
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    const [adminSearch, setAdminSearch] = useState('');

    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get('/api/admin/recent-updates', { headers });
                if (res.data.success) {
                    setNotifications(res.data.data);
                    setUnreadCount(res.data.data.length);
                }
            } catch (err) {
                console.error("Failed to fetch notifications", err);
            }
        };

        const fetchMessages = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await axios.get('/api/admin/recent-messages', { headers });
                if (res.data.success) {
                    setMessages(res.data.data);
                    setUnreadMessagesCount(res.data.data.length);
                }
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        fetchUpdates();
        fetchMessages();
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
            if (messagesDropdownRef.current && !messagesDropdownRef.current.contains(event.target)) {
                setShowMessages(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleNotifications = () => {
        if (!showNotifications) setShowMessages(false);
        setShowNotifications(!showNotifications);
        setUnreadCount(0);
    };

    const toggleMessages = () => {
        if (!showMessages) setShowNotifications(false);
        setShowMessages(!showMessages);
        setUnreadMessagesCount(0);
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.leftSection}>
                <button className={styles.menuButton} onClick={toggleSidebar} aria-label="Toggle Sidebar">
                    <Menu size={24} />
                </button>
                <form 
                    className={styles.searchBar} 
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (adminSearch.trim()) {
                            navigate(`/admin/products?search=${encodeURIComponent(adminSearch.trim())}`);
                        }
                    }}
                >
                    <Search size={18} color="var(--admin-text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={adminSearch}
                        onChange={(e) => setAdminSearch(e.target.value)}
                    />
                    {adminSearch && (
                        <button 
                            type="button" 
                            className={styles.clearSearch} 
                            onClick={() => setAdminSearch('')}
                        >
                            <X size={14} />
                        </button>
                    )}
                </form>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.actions}>
                    <button className={styles.iconButton} onClick={toggleTheme} aria-label="Toggle Theme">
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    
                    <div className={styles.relativeWrapper} ref={dropdownRef}>
                        <button 
                            className={styles.iconButton} 
                            onClick={toggleNotifications}
                            aria-label="Notifications"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>}
                        </button>
                        
                        {showNotifications && (
                            <div className={styles.notificationsDropdown}>
                                <div className={styles.notificationsHeader}>
                                    <h3>Recent Updates</h3>
                                </div>
                                <div className={styles.notificationsList}>
                                    {notifications.length > 0 ? (
                                        notifications.map((item, index) => (
                                            <div key={`notif-${item.type}-${item.id}-${index}`} className={styles.notificationItem}>
                                                <div className={`${styles.iconWrapper} ${styles[item.type]}`}>
                                                    {item.type === 'order' && <ShoppingCart size={18} />}
                                                    {item.type === 'user' && <User size={18} />}
                                                    {item.type === 'product' && <Package size={18} />}
                                                </div>
                                                <div className={styles.notificationContent}>
                                                    <p className={styles.notificationTitle}>{item.title}</p>
                                                    <p className={styles.notificationMessage}>{item.message}</p>
                                                    <span className={styles.notificationTime}>
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noNotifications}>No recent updates</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.relativeWrapper} ref={messagesDropdownRef}>
                        <button 
                            className={styles.iconButton} 
                            onClick={toggleMessages}
                            aria-label="Messages"
                        >
                            <MessageSquare size={20} />
                            {unreadMessagesCount > 0 && <span className={styles.badge}>{unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}</span>}
                        </button>
                        
                        {showMessages && (
                            <div className={styles.notificationsDropdown}>
                                <div className={styles.notificationsHeader}>
                                    <h3>Recent Messages</h3>
                                </div>
                                <div className={styles.notificationsList}>
                                    {messages.length > 0 ? (
                                        messages.map((item, index) => (
                                            <div key={`msg-${item.id}-${index}`} className={styles.notificationItem}>
                                                <div className={`${styles.iconWrapper} ${styles[item.type]}`}>
                                                    <MessageSquare size={18} />
                                                </div>
                                                <div className={styles.notificationContent}>
                                                    <p className={styles.notificationTitle}>{item.title}</p>
                                                    <p className={styles.notificationMessage}>{item.message}</p>
                                                    <span className={styles.notificationTime}>
                                                        {new Date(item.createdAt).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noNotifications}>No recent messages</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        {adminUser?.name?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <div className={styles.userInfo}>
                        <span className={styles.userName}>{adminUser?.name || 'Admin'}</span>
                        <span className={styles.userRole}>{adminUser?.role || 'Superadmin'}</span>
                    </div>
                    <button onClick={logoutAdmin} className={`${styles.iconButton} ${styles.logoutButton}`} aria-label="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
