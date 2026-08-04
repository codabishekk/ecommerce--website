import React, { useContext, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ThemeContext } from '../../../context/ThemeContext';
import useMediaQuery from '../../../hooks/useMediaQuery';
import styles from './DashboardCharts.module.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RegionRevenueChart = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const isMobile = useMediaQuery('(max-width: 768px)');

    const chartData = {
        labels: ['India', 'UK', 'UAE', 'USA', 'KSA', 'SG'],
        datasets: [
            {
                label: 'Revenue (k)',
                data: [42, 28, 18, 15, 11, 8],
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, '#10B981');
                    gradient.addColorStop(1, '#06B6D4');
                    return gradient;
                },
                borderRadius: 8,
                borderSkipped: false,
                barThickness: isMobile ? 20 : 'flex',
                maxBarThickness: isMobile ? 25 : 35
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
                    }
                }
            }
        }
    }), [isDark, isMobile]);

    return (
        <div className={styles.chartContainer}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default RegionRevenueChart;
