import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import styles from './KPICard.module.css';

const KPICard = ({ title, value, icon, trend, trendValue, colorClass }) => {
    // Replicating the blurred backdrop from the screenshot
    const getColors = () => {
        switch (colorClass) {
            case 'primary': return { bg: 'var(--admin-primary-light)', color: 'var(--admin-primary)' };
            case 'success': return { bg: 'var(--admin-success-light)', color: 'var(--admin-success)' };
            case 'warning': return { bg: 'var(--admin-warning-light)', color: 'var(--admin-warning)' };
            case 'purple': return { bg: 'rgba(168, 85, 247, 0.1)', color: '#A855F7' };
            default: return { bg: 'var(--admin-primary-light)', color: 'var(--admin-primary)' };
        }
    };

    const colors = getColors();
    const isPositive = trend === 'up';

    return (
        <div className={styles.kpiCard}>
            <div className={styles.iconWrapper} style={{ backgroundColor: colors.bg, color: colors.color }}>
                {icon}
            </div>
            <div className={styles.content}>
                <span className={styles.label}>{title}</span>
                <span className={styles.value}>{value}</span>
                {trendValue && (
                    <span className={`${styles.trend} ${isPositive ? styles.positive : styles.negative}`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {trendValue} this month
                    </span>
                )}
            </div>
        </div>
    );
};

export default KPICard;
