import React from 'react';
import { Ban, Trash2, CheckCircle } from 'lucide-react';
import styles from './UserTable.module.css';

const UserTable = ({ users, onToggleBlock, onDelete }) => {
    
    // Sort users: admins first, then regular users
    const sortedUsers = [...users].sort((a, b) => {
        if (a.isAdmin && !b.isAdmin) return -1;
        if (!a.isAdmin && b.isAdmin) return 1;
        return 0;
    });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.userTable}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Joined</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map(user => (
                        <tr key={user._id}>
                            <td>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className={styles.userMeta}>
                                        <span className={styles.userName}>{user.name}</span>
                                        <span className={styles.userEmail}>{user.email}</span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span className={`${styles.badge} ${user.isAdmin ? styles.admin : ''}`}>
                                    {user.isAdmin ? 'Admin' : 'Customer'}
                                </span>
                            </td>
                            <td>
                                <span className={`${styles.badge} ${user.isBlocked ? styles.blocked : styles.active}`}>
                                    {user.isBlocked ? 'Blocked' : 'Active'}
                                </span>
                            </td>
                            <td>{formatDate(user.createdAt)}</td>
                            <td>
                                <div className={styles.actions}>
                                    {!user.isAdmin && (
                                        <>
                                            <button 
                                                className={`${styles.iconBtn} ${user.isBlocked ? '' : styles.warning}`}
                                                onClick={() => onToggleBlock(user)}
                                                title={user.isBlocked ? "Unblock User" : "Block User"}
                                            >
                                                {user.isBlocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                                            </button>
                                            <button 
                                                className={`${styles.iconBtn} ${styles.danger}`}
                                                onClick={() => onDelete(user)}
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;
