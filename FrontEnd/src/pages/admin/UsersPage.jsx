import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import UserTable from '../../components/admin/Users/UserTable';
import ConfirmModal from '../../components/admin/common/ConfirmModal';
import { Search } from 'lucide-react';
import styles from './UsersPage.module.css';

const UsersPage = () => {
    const { token } = useAdminAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Modal State
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, user: null });

    const fetchUsers = async (signal) => {
        try {
            setLoading(true);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get('/api/admin/users', { 
                headers,
                signal // Pass the AbortSignal to axios
            });
            
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setUsers(data);
            setFilteredUsers(data);
        } catch (error) {
            // Only log if it's not a cancellation error
            if (!axios.isCancel(error)) {
                console.error('Failed to fetch users', error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        
        fetchUsers(controller.signal);

        return () => {
            controller.abort();
        };
    }, [token]);

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredUsers(users);
        } else {
            const lowerQuery = searchQuery.toLowerCase();
            const filtered = users.filter(u => 
                u.name?.toLowerCase().includes(lowerQuery) || 
                u.email?.toLowerCase().includes(lowerQuery)
            );
            setFilteredUsers(filtered);
        }
    }, [searchQuery, users]);

    const handleActionConfirm = async () => {
        const { type, user } = modalConfig;
        if (!user) return;

        try {
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            if (type === 'block') {
                await axios.put(`/api/admin/users/block/${user._id}`, {}, { headers });
                // Optimistic UI update
                setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
            } else if (type === 'delete') {
                await axios.delete(`/api/admin/users/${user._id}`, { headers });
                setUsers(prev => prev.filter(u => u._id !== user._id));
            }
        } catch (error) {
            console.error(`Failed to ${type} user`, error);
            alert(`Failed: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    return (
        <div>
            <div className={styles.pageHeader}>
                <div className={styles.title}>
                    <h2>Customers & Users</h2>
                    <p>Manage your platform's users, assign roles, and handle access control.</p>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBox}>
                    <Search size={18} color="var(--admin-text-muted)" />
                    <input 
                        type="text" 
                        placeholder="Search by name or email..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem' }}>Loading users...</div>
            ) : (
                <UserTable 
                    users={filteredUsers} 
                    onToggleBlock={(user) => setModalConfig({ isOpen: true, type: 'block', user })}
                    onDelete={(user) => setModalConfig({ isOpen: true, type: 'delete', user })}
                />
            )}

            <ConfirmModal 
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ isOpen: false, type: null, user: null })}
                onConfirm={handleActionConfirm}
                title={modalConfig.type === 'delete' ? 'Delete User' : (modalConfig.user?.isBlocked ? 'Unblock User' : 'Block User')}
                message={
                    modalConfig.type === 'delete' 
                        ? `Are you sure you want to permanently delete ${modalConfig.user?.name}? This action cannot be undone.`
                        : `Are you sure you want to ${modalConfig.user?.isBlocked ? 'unblock' : 'block'} ${modalConfig.user?.name}? ${!modalConfig.user?.isBlocked ? 'They will lose access to their account.' : 'They will regain access.'}`
                }
                isDanger={modalConfig.type === 'delete' || (!modalConfig.user?.isBlocked && modalConfig.type === 'block')}
                confirmText={modalConfig.type === 'delete' ? 'Delete' : (modalConfig.user?.isBlocked ? 'Unblock' : 'Block')}
            />
        </div>
    );
};

export default UsersPage;
