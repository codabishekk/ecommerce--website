import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import styles from './Login.module.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { loginAdmin } = useAdminAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await loginAdmin(email, password);
            if (res && res.success) {
                navigate('/admin/dashboard', { replace: true });
            } else {
                setError(res?.message || 'Invalid admin credentials');
            }
        } catch (err) {
            console.error('Login page crash:', err);
            setError(`Login call failed: ${err.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <Link to="/" className={styles.backHome}>
                <ArrowLeft size={16} />
                Back to Store
            </Link>
            
            <div className={styles.loginCard}>
                <div className={styles.brand}>
                    <div className={styles.logoIcon}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1>Admin Access</h1>
                    <p>Enter your credentials to access the dashboard</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.errorBox}>
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address</label>
                        <div className={styles.inputWrapper}>
                            <Mail className={styles.inputIcon} size={18} />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="admin@sholash.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Password</label>
                        <div className={styles.inputWrapper}>
                            <Lock className={styles.inputIcon} size={18} />
                            <input 
                                type="password" 
                                id="password" 
                                placeholder="••••••••" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required 
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
