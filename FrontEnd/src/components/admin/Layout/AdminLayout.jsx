import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAdminAuth } from '../../../context/AdminAuthContext';
import styles from './AdminLayout.module.css';

const AdminLayout = () => {
    // Basic mobile sidebar toggle state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { isAuthenticated, isAdminRehydrated } = useAdminAuth();

    // Prevent flicker while checking token
    if (!isAdminRehydrated) {
        return null; 
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className={styles.layoutContainer}>
            {/* Ambient background orbs */}
            <div className={`${styles.orb} ${styles.orb1}`}></div>
            <div className={`${styles.orb} ${styles.orb2}`}></div>
            <div className={`${styles.orb} ${styles.orb3}`}></div>

            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div className={styles.backdrop} onClick={toggleSidebar}></div>
            )}

            <div className={styles.mainContent}>
                <Topbar toggleSidebar={toggleSidebar} />
                <main className={styles.pageContainer}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
