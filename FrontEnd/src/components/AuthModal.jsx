import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext } from '../context/UserContext';
import { BASE_URL } from '../services/api';
import logo from '../assets/logo/logo.png';
import './AuthModal.css';

const API_URL = `${BASE_URL}/api/users`;

const AuthModal = ({ isOpen, onClose, product }) => {
    // ─── View Views ───────────────────────────────────────────────────────────
    // 'IDENTIFY', 'LOGIN', 'REGISTER', 'VERIFY_REG', 'FORGOT_EMAIL', 'FORGOT_RESET'
    const [view, setView] = useState('IDENTIFY');
    
    // ─── Form State ───────────────────────────────────────────────────────────
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    
    // ─── UI State ─────────────────────────────────────────────────────────────
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [timer, setTimer] = useState(0);
    const otpRefs = useRef([]);

    const { login } = useContext(UserContext);

    // Reset everything when modal opens
    useEffect(() => {
        if (isOpen) {
            setView('IDENTIFY');
            resetForms();
        }
    }, [isOpen]);

    // Timer for resending OTP
    useEffect(() => {
        let interval;
        if (timer > 0) {
            interval = setInterval(() => setTimer(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    if (!isOpen) return null;

    const resetForms = () => {
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setOtpDigits(['', '', '', '', '', '']);
        setNewPassword('');
        setError('');
        setSuccessMsg('');
        setLoading(false);
        setTimer(0);
    };

    const getCombinedOtp = () => otpDigits.join('');

    // ─── OTP Handlers ────────────────────────────────────────────────────────

    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otpDigits];
        newOtp[index] = value.slice(-1);
        setOtpDigits(newOtp);

        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleOtpPaste = (e) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
        const newOtp = [...otpDigits];
        pasteData.forEach((char, i) => {
            if (/^\d$/.test(char)) newOtp[i] = char;
        });
        setOtpDigits(newOtp);
        if (pasteData.length > 0) {
            const nextFocus = Math.min(pasteData.length, 5);
            otpRefs.current[nextFocus].focus();
        }
    };

    // ─── Actions ──────────────────────────────────────────────────────────────

    // 0. IDENTIFY (Amazon-style Step 1)
    const handleIdentify = async (e) => {
        e.preventDefault();
        const cleanEmail = email.toLowerCase().trim();
        if (!cleanEmail) return setError('Enter your email address to continue.');

        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_URL}/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: cleanEmail })
            });

            const data = await res.json();
            if (data.success) {
                if (data.exists) {
                    setName(data.name);
                    setView('LOGIN');
                } else {
                    setView('REGISTER');
                }
            } else {
                setError('Something went wrong. Please try again.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    // 1. LOGIN (Amazon-style Step 2)
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        if (!password) return setError('Please enter your password.');
        
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase().trim(), password })
            });
            const data = await res.json();
            if (data.success) {
                onAuthSuccess(data);
            } else {
                setError(data.message || 'Invalid password.');
            }
        } catch (err) {
            setError('Connection error. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    // 2. REQUEST REGISTRATION (Send OTP)
    const handleRequestRegister = async (e) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) return setError('All fields are required.');
        if (password !== confirmPassword) return setError('Passwords do not match.');
        if (password.length < 6) return setError('Password must be at least 6 characters.');

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/request-register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: email.toLowerCase().trim() })
            });
            const data = await res.json();
            if (data.success) {
                setView('VERIFY_REG');
                setOtpDigits(['', '', '', '', '', '']);
                setTimer(30);
            } else {
                setError(data.message || 'Failed to send verification code.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    // 3. COMPLETE REGISTRATION (Verify OTP)
    const handleVerifyRegister = async (e) => {
        if (e) e.preventDefault();
        setError('');
        const otp = getCombinedOtp();
        if (otp.length < 6) return setError('Please enter the 6-digit OTP.');

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email: email.toLowerCase().trim(), password, otp })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg('Account created successfully!');
                onAuthSuccess(data);
            } else {
                setError(data.message || 'Verification failed.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    // 4. FORGOT PASSWORD - REQUEST RESET
    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        if (!email) return setError('Please enter your email.');

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase().trim() })
            });
            const data = await res.json();
            if (data.success) {
                setView('FORGOT_RESET');
                setOtpDigits(['', '', '', '', '', '']);
                setTimer(30);
            } else {
                setError(data.message || 'User not found.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    // 5. COMPLETE PASSWORD RESET
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        const otp = getCombinedOtp();
        if (otp.length < 6 || !newPassword) return setError('Please enter OTP and new password.');
        if (newPassword !== confirmPassword) return setError('Passwords do not match.');
        if (newPassword.length < 6) return setError('Password must be at least 6 characters.');

        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.toLowerCase().trim(), otp, newPassword })
            });
            const data = await res.json();
            if (data.success) {
                setSuccessMsg('Password reset successful! Please sign in.');
                setTimeout(() => {
                    resetForms();
                    setView('LOGIN');
                }, 2000);
            } else {
                setError(data.message || 'Reset failed.');
            }
        } catch (err) {
            setError('Server connection error.');
        } finally {
            setLoading(false);
        }
    };

    const onAuthSuccess = (data) => {
        login({ 
            _id: data._id, 
            name: data.name, 
            contact: data.email,
            token: data.token 
        });
        setTimeout(() => onClose(), 1500);
    };

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('auth-modal-backdrop')) onClose();
    };

    // ─── Render View Helpers ──────────────────────────────────────────────────

    const renderHeader = (title, subtitle) => (
        <div className="auth-modal-header">
            <div className="auth-modal-logo">
                <img src={logo} alt="Sholash Logo" className="auth-logo-img" />
            </div>
            <h2 className="serif auth-modal-title">{title}</h2>
            {subtitle && <p className="auth-modal-subtitle">{subtitle}</p>}
        </div>
    );

    const renderError = () => error && (
        <p className="auth-error">{error}</p>
    );

    const renderSuccess = () => successMsg && (
        <div className="auth-modal-body auth-success-body">
            <div className="auth-success-icon">✅</div>
            <h3 className="auth-success-name">{successMsg}</h3>
            <p className="auth-success-msg">
                {product ? `You can now proceed to purchase ${product.name}.` : 'Welcome to Sholash Life Science.'}
            </p>
        </div>
    );

    return (
        <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
            <div className="auth-modal-card auth-modal-enter">
                <button className="auth-modal-close" onClick={onClose}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>

                {successMsg ? renderSuccess() : (
                    <>
                        {/* ─── 0. IDENTIFY VIEW ─────────────────────────────────── */}
                        {view === 'IDENTIFY' && (
                            <>
                                {renderHeader('Sign in', 'Use your email to continue')}
                                <div className="auth-modal-body">
                                    {renderError()}
                                    <form onSubmit={handleIdentify} className="auth-form">
                                        <div className="auth-input-group">
                                            <label className="auth-label">Email</label>
                                            <input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                                        </div>
                                        <button type="submit" className="auth-btn-primary" disabled={loading}>
                                            {loading ? <span className="auth-spinner" /> : 'Continue'}
                                        </button>
                                    </form>
                                    <p className="auth-footer-text" style={{ textAlign: 'left', marginTop: '15px', color: '#555' }}>
                                        By continuing, you agree to Sholash's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.
                                    </p>
                                    
                                    <div className="auth-footer-divider" data-text="New to Sholash?"></div>
                                    <button className="auth-btn-sec" onClick={() => setView('REGISTER')}>Create your Sholash account</button>
                                </div>
                            </>
                        )}

                        {/* ─── 1. LOGIN VIEW ────────────────────────────────────── */}
                        {view === 'LOGIN' && (
                            <>
                                {renderHeader('Sign in', '')}
                                <div className="auth-modal-body">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                                        <span style={{ fontSize: '14px', color: '#111' }}>{email}</span>
                                        <button onClick={() => setView('IDENTIFY')} style={{ background: 'none', border: 'none', color: '#0066c0', fontSize: '13px', cursor: 'pointer' }}>Change</button>
                                    </div>
                                    {renderError()}
                                    <form onSubmit={handleLogin} className="auth-form">
                                        <div className="auth-input-group">
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <label className="auth-label">Password</label>
                                                <button type="button" className="auth-btn-back" style={{ padding: 0, margin: 0 }} onClick={() => setView('FORGOT_EMAIL')}>Forgot Password?</button>
                                            </div>
                                            <div style={{ position: 'relative' }}>
                                                <input className="auth-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} autoFocus />
                                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="eye-btn" style={{ right: '15px' }}>{showPassword ? '👁️‍🗨️' : '👁️'}</button>
                                            </div>
                                        </div>
                                        <button type="submit" className="auth-btn-primary" disabled={loading}>
                                            {loading ? <span className="auth-spinner" /> : 'Sign in'}
                                        </button>
                                    </form>
                                </div>
                            </>
                        )}

                        {/* ─── 2. REGISTER VIEW ─────────────────────────────────── */}
                        {view === 'REGISTER' && (
                            <>
                                {renderHeader('Create account', '')}
                                <div className="auth-modal-body">
                                    {renderError()}
                                    <form onSubmit={handleRequestRegister} className="auth-form">
                                        <div className="auth-input-group"><label className="auth-label">Your name</label><input className="auth-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="First and last name" autoFocus /></div>
                                        <div className="auth-input-group"><label className="auth-label">Email</label><input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                                        <div className="auth-input-group"><label className="auth-label">Password</label><input className="auth-input" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" /></div>
                                        <div className="auth-input-group"><label className="auth-label">Re-enter password</label><input className="auth-input" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
                                        <button type="submit" className="auth-btn-primary" disabled={loading}>{loading ? <span className="auth-spinner" /> : 'Continue'}</button>
                                    </form>
                                    <div className="auth-footer-divider" data-text="Already have an account?"></div>
                                    <button className="auth-btn-sec" onClick={() => setView('IDENTIFY')}>Sign in</button>
                                </div>
                            </>
                        )}

                        {/* ─── 3. VERIFY REGISTRATION ──────────────────────────── */}
                        {view === 'VERIFY_REG' && (
                            <>
                                {renderHeader('Verify email address', `To verify your email, we've sent a One Time Password (OTP) to ${email}`)}
                                <div className="auth-modal-body">
                                    {renderError()}
                                    <div className="otp-boxes" onPaste={handleOtpPaste}>
                                        {otpDigits.map((digit, i) => (
                                            <input
                                                key={i}
                                                ref={el => otpRefs.current[i] = el}
                                                className="otp-box"
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={e => handleOtpChange(i, e.target.value)}
                                                onKeyDown={e => handleOtpKeyDown(i, e)}
                                                autoFocus={i === 0}
                                            />
                                        ))}
                                    </div>
                                    <button onClick={handleVerifyRegister} className="auth-btn-primary" disabled={loading}>
                                        {loading ? <span className="auth-spinner" /> : 'Create your Sholash account'}
                                    </button>
                                    <div className="auth-resend-row">
                                        {timer > 0 ? <span className="auth-timer">Resend OTP in {timer}s</span> : 
                                        <button className="auth-btn-resend" onClick={handleRequestRegister}>Resend OTP</button>}
                                    </div>
                                    <button className="auth-btn-back" onClick={() => setView('REGISTER')}>← Change Details</button>
                                </div>
                            </>
                        )}

                        {/* ─── 4. FORGOT PASSWORD - EMAIL ──────────────────────── */}
                        {view === 'FORGOT_EMAIL' && (
                            <>
                                {renderHeader('Password assistance', 'Enter the email address associated with your Sholash account.')}
                                <div className="auth-modal-body">
                                    {renderError()}
                                    <form onSubmit={handleRequestReset} className="auth-form">
                                        <div className="auth-input-group"><label className="auth-label">Email</label><input className="auth-input" type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
                                        <button type="submit" className="auth-btn-primary" disabled={loading}>{loading ? <span className="auth-spinner" /> : 'Continue'}</button>
                                    </form>
                                    <button className="auth-btn-back" onClick={() => setView('LOGIN')}>← Back to Sign in</button>
                                </div>
                            </>
                        )}

                        {/* ─── 5. FORGOT PASSWORD - RESET ─────────────────────── */}
                        {view === 'FORGOT_RESET' && (
                            <>
                                {renderHeader('Reset password', `OTP sent to ${email}`)}
                                <div className="auth-modal-body">
                                    {renderError()}
                                    <form onSubmit={handleResetPassword} className="auth-form">
                                        <div className="otp-boxes" onPaste={handleOtpPaste}>
                                            {otpDigits.map((digit, i) => (
                                                <input
                                                    key={i}
                                                    ref={el => otpRefs.current[i] = el}
                                                    className="otp-box"
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={e => handleOtpChange(i, e.target.value)}
                                                    onKeyDown={e => handleOtpKeyDown(i, e)}
                                                    autoFocus={i === 0}
                                                />
                                            ))}
                                        </div>
                                        <div className="auth-input-group"><label className="auth-label">New Password</label><input className="auth-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} /></div>
                                        <div className="auth-input-group"><label className="auth-label">Confirm Password</label><input className="auth-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} /></div>
                                        <button type="submit" className="auth-btn-primary" disabled={loading}>{loading ? <span className="auth-spinner" /> : 'Save and Sign in'}</button>
                                    </form>
                                    <div className="auth-resend-row" style={{ marginTop: '10px' }}>
                                        {timer > 0 ? <span className="auth-timer">Resend OTP in {timer}s</span> : 
                                        <button className="auth-btn-resend" onClick={handleRequestReset}>Resend OTP</button>}
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                )}
                
                {/* Step indicator dots */}
                <div className="auth-step-dots" style={{ marginTop: '20px' }}>
                    <span className={`auth-dot ${view === 'IDENTIFY' || view === 'REGISTER' || view === 'FORGOT_EMAIL' ? 'active shadow' : ''}`}></span>
                    <span className={`auth-dot ${view === 'LOGIN' || view === 'VERIFY_REG' || view === 'FORGOT_RESET' ? 'active shadow' : ''}`}></span>
                    <span className={`auth-dot ${successMsg ? 'active shadow' : ''}`}></span>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
