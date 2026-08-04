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
import styles from './DashboardCharts.module.css';

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

const TrafficTrendChart = ({ timeframe }) => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

    const dailyData = {
        labels: ['6am', '9am', '12pm', '3pm', '6pm', '9pm'],
        data: [120, 450, 800, 600, 950, 400]
    };

    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [1200, 1500, 1100, 1800, 2200, 2500, 1900]
    };

    const monthlyData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        data: [18200, 22400, 20100, 29800, 26300, 34100]
    };

    const yearlyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [85000, 92000, 78000, 110000, 105000, 130000, 125000, 140000, 135000, 160000, 155000, 180000]
    };

    const getData = () => {
        switch (timeframe) {
            case 'Day': return dailyData;
            case 'Week': return weeklyData;
            case 'Month': return monthlyData;
            case 'Year': return yearlyData;
            default: return monthlyData;
        }
    };

    const activeData = getData();

    const chartData = {
        labels: activeData.labels,
        datasets: [
            {
                label: 'Visitors',
                data: activeData.data,
                borderColor: '#06B6D4',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(6, 182, 212, 0.2)');
                    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
                    return gradient;
                },
                borderWidth: isMobile ? 2 : 3,
                pointBackgroundColor: '#06B6D4',
                pointBorderColor: isDark ? '#1E293B' : '#ffffff',
                pointBorderWidth: isMobile ? 1 : 2,
                pointRadius: isMobile ? 3 : 5,
                pointHoverRadius: 7,
                fill: true,
                tension: 0.4
            }
        ],
    };

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: isDark ? '#334155' : '#ffffff',
                titleColor: isDark ? '#F8FAFC' : '#0F172A',
                bodyColor: isDark ? '#94A3B8' : '#64748B',
                borderColor: isDark ? '#475569' : '#E2E8F0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: isDark ? '#334155' : '#F1F5F9', drawBorder: false },
                ticks: {
                    color: isDark ? '#94A3B8' : '#64748B',
                    font: { 
                        family: 'Inter, sans-serif',
                        size: isMobile ? 10 : 12 
                    }
                }
            },
            x: {
                grid: { display: false, drawBorder: false },
                ticks: {
                    color: isDark ? '#94A3B8' : '#64748B',
                    font: { 
                        family: 'Inter, sans-serif',
                        size: isMobile ? 10 : 12 
                    },
                    maxTicksLimit: isMobile ? 6 : 12
                }
            }
        }
    }), [isDark, isMobile]);

    return (
        <div className={styles.chartContainer}>
            <Line data={chartData} options={options} key={`${timeframe}-${isMobile}`} />
        </div>
    );
};

export default TrafficTrendChart;
