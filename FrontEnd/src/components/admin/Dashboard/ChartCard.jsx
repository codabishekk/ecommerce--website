import React from 'react';
import styles from './ChartCard.module.css';

const ChartCard = ({ title, children, actions }) => {
    return (
        <div className={styles.chartCard}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                {actions && <div className={styles.actions}>{actions}</div>}
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
