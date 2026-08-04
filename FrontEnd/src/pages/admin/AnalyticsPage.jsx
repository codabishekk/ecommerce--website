import React, { useState } from 'react';
import styles from './AnalyticsPage.module.css';
import { Eye, MousePointer2, RefreshCw, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Components
import KPICard from '../../components/admin/Dashboard/KPICard';
import ChartCard from '../../components/admin/Dashboard/ChartCard';
import TrafficTrendChart from '../../components/admin/Dashboard/TrafficTrendChart';
import RegionRevenueChart from '../../components/admin/Dashboard/RegionRevenueChart';
import DeviceDonutChart from '../../components/admin/Dashboard/DeviceDonutChart';

const AnalyticsPage = () => {
    const [timeframe, setTimeframe] = useState('Month');
    const timeframes = ['Day', 'Week', 'Month', 'Year'];

    return (
        <div className={`${styles.analytics} admin-fade-in-up`}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h2>Analytics</h2>
                    <p>Deep dive into your business metrics.</p>
                </div>
            </div>

            <div className={styles.kpiGrid}>
                <KPICard 
                    title="Page Views" 
                    value="1.24M" 
                    icon={<Eye size={24} />} 
                    colorClass="primary"
                    trend="up"
                    trendValue="+18%"
                />
                <KPICard 
                    title="Click Rate" 
                    value="4.8%" 
                    icon={<MousePointer2 size={24} />} 
                    colorClass="primary"
                    trend="up"
                    trendValue="+2.1%"
                />
                <KPICard 
                    title="Return Rate" 
                    value="34.2%" 
                    icon={<RefreshCw size={24} />} 
                    colorClass="warning"
                    trend="down"
                    trendValue="-1.5%"
                />
                <KPICard 
                    title="Avg Session" 
                    value="3m 42s" 
                    icon={<Clock size={24} />} 
                    colorClass="primary"
                    trend="up"
                    trendValue="+0.8%"
                />
            </div>

            <div className={styles.chartsGrid}>
                <ChartCard 
                    title="Traffic Trend"
                    actions={
                        <div className={styles.timeframeToggle}>
                            {timeframes.map(tf => (
                                <button 
                                    key={tf}
                                    className={`${styles.tfBtn} ${timeframe === tf ? styles.activeTf : ''}`}
                                    onClick={() => setTimeframe(tf)}
                                >
                                    {tf}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <TrafficTrendChart timeframe={timeframe} />
                </ChartCard>
            </div>

            <div className={styles.bottomGrid}>
                <ChartCard title="Top Regions">
                    <RegionRevenueChart />
                </ChartCard>
                <ChartCard title="Devices">
                    <DeviceDonutChart />
                </ChartCard>
            </div>
        </div>
    );
};

export default AnalyticsPage;
