import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, ShieldCheck, Image as ImageIcon } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../assets/logo/logo_symbol.png';
import styles from './Sidebar.module.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navItems = [
        { path: '/admin/dashboard', icon: <LayoutDashboard className={styles.navIcon} />, label: 'Dashboard' },
        { path: '/admin/orders', icon: <ShoppingCart className={styles.navIcon} />, label: 'Orders' },                        
        { path: '/admin/products', icon: <Package className={styles.navIcon} />, label: 'Products' },
        { path: '/admin/banners', icon: <ImageIcon className={styles.navIcon} />, label: 'Banners' },
        { path: '/admin/users', icon: <Users className={styles.navIcon} />, label: 'Customers' },                                     
        { path: '/admin/analytics', icon: <FontAwesomeIcon icon={faChartColumn} className={styles.navIcon} />, label: 'Analytics' },
    ];

    const settingsItems = [
        { path: '/admin/roles', icon: <ShieldCheck className={styles.navIcon} />, label: 'Roles & Permissions' },
        { path: '/admin/settings', icon: <Settings className={styles.navIcon} />, label: 'Settings' },
    ];

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.brand}>
                <div className={styles.brandIcon}>
                    <img src={logo} alt="Sholash Logo" className={styles.logoImg} />
                </div>
                <div className={styles.brandText}>Sholash Admin</div>
            </div>

            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                        onClick={() => { if(window.innerWidth <= 768) toggleSidebar(); }}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}

                <div style={{ margin: '1rem 0', padding: '0 1rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--admin-text-muted)', textTransform: 'uppercase' }}>
                    System
                </div>

                {settingsItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                        onClick={() => { if(window.innerWidth <= 768) toggleSidebar(); }}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className={styles.systemStatus}>
                <div className={styles.statusDot}></div>
                All systems live
            </div>
        </aside>
    );
};

export default Sidebar;
