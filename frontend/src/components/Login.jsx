import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_CONFIG from '../config/api';
import '../styles/login.css';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const reporterRoles = ['مقرر', 'rapporteur', 'rapporteur_comite', 'reporter_comite'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(API_CONFIG.AUTH.LOGIN, {
                email,
                password
            });

            const { accessToken, user } = response.data || {};
            const roles = Array.isArray(user?.roles) ? user.roles : [];
            const committeeRoles = Array.isArray(user?.committeeRoles) ? user.committeeRoles : [];
            const permissions = Array.isArray(user?.permissions) ? user.permissions : [];
            const primaryRole = roles[0] || '';
            const normalizedAppRoles = roles.map((r) => String(r || '').toLowerCase());
            const normalizedCommitteeRoles = committeeRoles.map((r) => String(r || '').toLowerCase());
            const isRapporteur = reporterRoles.some((roleName) =>
                normalizedAppRoles.includes(roleName.toLowerCase()) ||
                normalizedCommitteeRoles.includes(roleName.toLowerCase())
            );

            localStorage.setItem('token', accessToken || '');
            localStorage.setItem('permissions', JSON.stringify(permissions));
            localStorage.setItem('roles', JSON.stringify(roles));
            localStorage.setItem('currentUser', JSON.stringify(user || {}));
            localStorage.setItem('nomPrenom', user?.email || 'Utilisateur');

            if (primaryRole === 'admin_informatique') {
                // Admin Informatique
                navigate('/admin-dashboard');
            } else if (primaryRole === 'admin_cabinet') {
                // Admin Cabinet
                navigate('/admin-cabinet/dashboard');
            } else if (primaryRole === 'user') {
                // Base application role stays "user".
                // Committee roles like rapporteur add extra workspace access,
                // but should not replace the normal user dashboard.
                navigate('/dashboard');
            } else if (isRapporteur) {
                // Fallback for users that only have committee rapporteur access
                navigate('/comite/rapporteur/dashboard');
            } else if (primaryRole === 'directeur') {
                // Directeur
                navigate('/directeur/acceuildashboard');
            } else {
                // Default to user dashboard
                navigate('/dashboard');
            }
        } catch (err) {
            // Extract error message from response
            let errorMsg = 'خطأ في الاتصال';
            if (err.response) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    errorMsg = data;
                } else if (data && data.message) {
                    errorMsg = data.message;
                } else if (data && data.error) {
                    errorMsg = `${data.error}: ${data.message || data.details}`;
                }
            }
            setError(errorMsg);
            console.error('Erreur:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper" dir="rtl">
            {/* Éléments de Background */}
            <div className="dot-overlay"></div>
            <div className="glow orb-red"></div>
            <div className="glow orb-blue"></div>

            <div className="orbit orbit-1"></div>
            <div className="orbit orbit-2"></div>

            {/* Carte de Connexion */}
            <motion.div 
                className="login-card"
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
            >
                                <motion.div 
                                        className="login-header"
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                >
                                    <div className="login-logo-min">
                                        <img src="/images/logo_mini.png" alt="Logo" className="login-logo" />
                                    </div>
                                    <h2 className="login-app-name">منظومة إدارة ومتابعة الجلسات</h2>
                                </motion.div>

                {error && (
                    <motion.div 
                        className="error-message"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </motion.div>
                )}

             

                <form onSubmit={handleSubmit}>
                    <motion.div 
                        className="field"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <label>البريد الإلكتروني</label>
                        <div className="input-box">
                            <Mail size={18} />
                            <input 
                                type="email" 
                                placeholder="name@ministry.tn"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </motion.div>

                    <motion.div 
                        className="field"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="row">
                            <label>كلمة السر</label>
                            <a href="#" className="forgot-link">نسيت كلمة السر؟</a>
                        </div>
                        <div className="input-box">
                            <Lock size={18} />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button 
                                type="button" 
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </motion.div>

                    <motion.button 
                        type="submit" 
                        className="btn"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
                    </motion.button>

                </form>

                <motion.div 
                    className="footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <strong>وزارة الفلاحة والموارد المائية والصيد البحري</strong>
                    <p>الإدارة العامة للتنظيم والاعلامية والتصرف في الوثائق والأرشيف</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Login;
