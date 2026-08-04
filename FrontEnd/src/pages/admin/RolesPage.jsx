import React, { useState, useEffect } from 'react';
import { Shield, CheckCircle, Info, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import styles from './RolesPage.module.css';

const RolesPage = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('sholash_admin_token');
            const res = await axios.get('/api/admin/roles', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setRoles(res.data.data);
            }
        } catch (err) {
            console.error('Error fetching roles:', err);
            setError('Failed to load roles. Please ensure you have superadmin privileges.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingState}>
                <Loader2 className={styles.spinner} size={40} />
                <p>Loading security roles...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorState}>
                <AlertCircle size={48} color="var(--admin-danger)" />
                <h3>Access Denied</h3>
                <p>{error}</p>
                <button className={styles.retryBtn} onClick={fetchRoles}>Retry</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2>Roles & Permissions</h2>
                    <p>Manage access levels and security assignments for your team.</p>
                </div>
                <div className={styles.badge}>
                    <Shield size={16} />
                    <span>RBAC Active</span>
                </div>
            </div>

            <div className={styles.rolesGrid}>
                {roles.map(role => (
                    <div key={role._id} className={styles.roleCard}>
                        <div className={styles.roleHeader}>
                            <div className={styles.roleIcon}>
                                <Shield size={24} />
                            </div>
                            <div className={styles.roleMeta}>
                                <h3>{role.name}</h3>
                                {role.isSystem && <span className={styles.systemTag}>System Role</span>}
                            </div>
                        </div>
                        
                        <p className={styles.description}>{role.description || 'No description provided.'}</p>

                        <div className={styles.permissionsLabel}>
                            <CheckCircle size={14} />
                            <span>Granted Permissions ({role.permissions?.length || 0})</span>
                        </div>

                        <div className={styles.permissionsList}>
                            {role.permissions && role.permissions.length > 0 ? (
                                role.permissions.map(perm => (
                                    <div key={perm._id} className={styles.permTag} title={perm.description}>
                                        {perm.name}
                                    </div>
                                ))
                            ) : (
                                <p className={styles.noneText}>No permissions assigned.</p>
                            )}
                        </div>
                        
                        {!role.isSystem && (
                            <button className={styles.editBtn}>Manage Permissions</button>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.infoCard}>
                <Info size={20} />
                <div className={styles.infoText}>
                    <h4>Role Inheritance</h4>
                    <p>Roles follow a hierarchy. Permissions granted to lower roles are automatically inherited by higher-level roles to ensure consistency across the system.</p>
                </div>
            </div>
        </div>
    );
};

export default RolesPage;
