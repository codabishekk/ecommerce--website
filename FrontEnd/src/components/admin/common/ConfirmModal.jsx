import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import styles from './ConfirmModal.module.css';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isDanger = false, confirmText = "Confirm" }) => {
    return (
        <div className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 className={`${styles.title} ${isDanger ? styles.danger : ''}`}>
                    {isDanger ? <AlertTriangle size={24} /> : <AlertCircle size={24} />}
                    {title}
                </h3>
                <p className={styles.message}>{message}</p>
                
                <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className={`${styles.btn} ${isDanger ? styles.btnDanger : styles.btnConfirm}`}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
