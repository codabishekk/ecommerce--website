import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import api from '../services/api';

export const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
    const [isAdminRehydrated, setIsAdminRehydrated] = useState(false);
    const [adminUser, setAdminUser] = useState(null);
    const [token, setToken] = useState(null);
    // Track if a login is in progress so the interceptor doesn't auto-logout on a failed login
    const isLoggingIn = useRef(false);

    useEffect(() => {
        const savedToken = localStorage.getItem('sholash_admin_token');
        const savedUser = localStorage.getItem('sholash_admin_user');
        
        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setAdminUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('sholash_admin_token');
                localStorage.removeItem('sholash_admin_user');
            }
        }
        setIsAdminRehydrated(true);

        // Auto-logout on 401 from protected endpoints, but NOT during login itself
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401 && !isLoggingIn.current) {
                    logoutAdmin();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, []);

    const loginAdmin = async (email, password) => {
        isLoggingIn.current = true;
        try {
            const res = await api.post('/api/admin/login', { email, password });
            if (res.data.success) {
                const { token, ...userData } = res.data.data;
                setToken(token);
                setAdminUser(userData);
                localStorage.setItem('sholash_admin_token', token);
                localStorage.setItem('sholash_admin_user', JSON.stringify(userData));
                return { success: true };
            }
            return { success: false, message: res.data.message || 'Invalid admin credentials' };
        } catch (error) {
            console.error('Admin login call failed:', error);
            // Provide a meaningful error: backend message → network error → generic fallback
            const message = error.response?.data?.message
                || (error.code === 'ERR_NETWORK' ? 'Cannot reach server. Please try again in a moment.' : null)
                || 'Login failed. Please check your credentials and try again.';
            return { success: false, message };
        } finally {
            isLoggingIn.current = false;
        }
    };

    const logoutAdmin = () => {
        setToken(null);
        setAdminUser(null);
        localStorage.removeItem('sholash_admin_token');
        localStorage.removeItem('sholash_admin_user');
    };

    return (
        <AdminAuthContext.Provider value={{
            adminUser,
            token,
            isAdminRehydrated,
            loginAdmin,
            logoutAdmin,
            isAuthenticated: !!token
        }}>
            {children}
        </AdminAuthContext.Provider>
    );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

