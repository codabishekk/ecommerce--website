import React, { useContext, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { ThemeContext } from '../../../context/ThemeContext';
import useMediaQuery from '../../../hooks/useMediaQuery';
import styles from './RevenueChart.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ data, timeRange = 'Monthly' }) => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [hiddenDatasets, setHiddenDatasets] = React.useState({ revenue: false, prevYear: false });

    // Mock data patterns for different time ranges
    const getMockData = () => {
        if (timeRange === 'Daily') {
            return [
                { name: 'Mon', Revenue: 4200 }, { name: 'Tue', Revenue: 3800 }, 
                { name: 'Wed', Revenue: 5100 }, { name: 'Thu', Revenue: 4600 }, 
                { name: 'Fri', Revenue: 6200 }, { name: 'Sat', Revenue: 7500 }, 
                { name: 'Sun', Revenue: 5800 }
            ];
        }
        if (timeRange === 'Weekly') {
            return [
                { name: 'Week 1', Revenue: 15000 }, { name: 'Week 2', Revenue: 22000 }, 
                { name: 'Week 3', Revenue: 18500 }, { name: 'Week 4', Revenue: 28000 }
            ];
        }
        return [
            { name: 'Sep', Revenue: 32000 }, { name: 'Oct', Revenue: 41000 }, 
            { name: 'Nov', Revenue: 38000 }, { name: 'Dec', Revenue: 55000 }, 
            { name: 'Jan', Revenue: 49000 }, { name: 'Feb', Revenue: 68000 }
        ];
    };

    const actualData = data?.length > 0 && timeRange === 'Monthly' ? data : getMockData();

    const toggleDataset = (type) => {
        setHiddenDatasets(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const chartData = {
        labels: actualData.map(d => d.name),
        datasets: [
            {
                label: 'Revenue',
                data: actualData.map(d => d.Revenue),
                borderColor: '#60A5FA',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(96, 165, 250, 0.2)');
                    gradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
                    return gradient;
                },
                borderWidth: isMobile ? 2 : 3,
                pointBackgroundColor: '#60A5FA',
                pointBorderColor: isDark ? '#0F172A' : '#ffffff',
                pointBorderWidth: isMobile ? 2 : 3,
                pointRadius: isMobile ? 3 : 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4,
                hidden: hiddenDatasets.revenue
            },
            {
                label: 'Prev Year',
                data: actualData.map(d => d.Revenue * 0.7 + Math.random() * (timeRange === 'Daily' ? 1000 : 5000)), 
                borderColor: '#6366F1',
                borderDash: [5, 5],
                borderWidth: isMobile ? 1 : 2,
                pointRadius: 0,
                fill: false,
                tension: 0.4,
                hidden: hiddenDatasets.prevYear
            }
        ],
    };

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: isMobile ? 5 : 0,
                right: isMobile ? 5 : 0,
                top: 0,
                bottom: 5
            }
        },
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#1E293B' : '#ffffff',
                titleColor: isDark ? '#F8FAFC' : '#0F172A',
                bodyColor: '#94A3B8',
                borderColor: isDark ? '#334155' : '#E2E8F0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function(context) {
                        return `${context.dataset.label}: ₹${context.parsed.y.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(241, 245, 249, 0.8)',
                    drawBorder: false,
                },
                ticks: {
                    color: '#64748B',
                    font: { 
                        family: 'Inter, sans-serif', 
                        size: isMobile ? 10 : 11 
                    },
                    padding: isMobile ? 5 : 10,
                    callback: function(value) {
                        return value >= 1000 ? `${value / 1000}k` : value;
                    }
                }
            },
            x: {
                grid: { display: false, drawBorder: false },
                offset: false,
                ticks: {
                    color: '#64748B',
                    font: { 
                        family: 'Inter, sans-serif', 
                        size: isMobile ? 10 : 11 
                    },
                    padding: isMobile ? 5 : 10,
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: isMobile ? 6 : 12
                }
            }
        }
    }), [isDark, isMobile]);

    return (
        <div className={styles.chartWrapper}>
            <div className={styles.legendContainer} style={{ color: isDark ? '#94A3B8' : '#64748B' }}>
                <div 
                    onClick={() => toggleDataset('revenue')}
                    className={`${styles.legendItem} ${hiddenDatasets.revenue ? styles.itemHidden : ''}`}
                >
                    <div className={`${styles.legendDot} ${styles.revenueDot}`}></div>
                    <span className={styles.legendText}>Revenue</span>
                </div>
                <div 
                    onClick={() => toggleDataset('prevYear')}
                    className={`${styles.legendItem} ${hiddenDatasets.prevYear ? styles.itemHidden : ''}`}
                >
                    <div className={`${styles.legendDot} ${styles.prevYearDot}`}></div>
                    <span className={styles.legendText}>Prev Year</span>
                </div>
            </div>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default RevenueChart;
