import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL.replace('/api', '');
    }
    return window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : 'https://sholash-life-science.onrender.com';
};

export const BASE_URL = getBaseURL();

const api = axios.create({
    baseURL: BASE_URL
});

// Optional: Add request interceptor for tokens
api.interceptors.request.use(config => {
    const adminToken = localStorage.getItem('sholash_admin_token');
    const userToken = JSON.parse(localStorage.getItem('user'))?.token;
    const token = adminToken || userToken;
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
