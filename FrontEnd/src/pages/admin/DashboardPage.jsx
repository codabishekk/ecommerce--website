import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import styles from './DashboardPage.module.css';

// Components
import KPICard from '../../components/admin/Dashboard/KPICard';
import ChartCard from '../../components/admin/Dashboard/ChartCard';
import RevenueChart from '../../components/admin/Dashboard/RevenueChart';
import OrdersChart from '../../components/admin/Dashboard/OrdersChart';
import SalesPieChart from '../../components/admin/Dashboard/SalesPieChart';

// Icons
import { IndianRupee, ShoppingCart, Package, Users, Calendar, Download, Eye, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

const DashboardPage = () => {
    const { token } = useAdminAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const month = selectedDate.getMonth() + 1;
            const year = selectedDate.getFullYear();
            
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get(`/api/admin/dashboard?month=${month}&year=${year}`, { headers });
            
            if (res.data.success) {
                setStats(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch dashboard stats", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [token, selectedDate]);

    const handlePrevMonth = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + 1);
            return newDate;
        });
    };

    const formatMonthYear = (date) => {
        return date.toLocaleString('default', { month: 'short', year: 'numeric' });
    };

    const [revenueTimeRange, setRevenueTimeRange] = useState('Monthly');

    if (loading) return <div style={{ padding: '2rem' }}>Loading Dashboard...</div>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <h2>Dashboard</h2>
                    <p>Welcome back, Admin. Here's what's happening.</p>
                </div>
                <div className={styles.headerActions}>
                    <div className={styles.dateNavigator}>
                        <button className={styles.navBtn} onClick={handlePrevMonth}>
                            <ChevronLeft size={18} />
                        </button>
                        <div className={styles.currentDate}>
                            <Calendar size={16} />
                            <span>{formatMonthYear(selectedDate)}</span>
                        </div>
                        <button className={styles.navBtn} onClick={handleNextMonth}>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                    <button className={styles.btnExport}>
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className={styles.kpiGrid}>
                <KPICard 
                    title="Total Revenue" 
                    value={formatCurrency(stats?.totalRevenue)} 
                    icon={<IndianRupee size={24} />} 
                    colorClass="primary"
                    trend="up"
                    trendValue="+12.5%"
                />
                <KPICard 
                    title="Total Orders" 
                    value={stats?.totalOrders || 0} 
                    icon={<ShoppingCart size={24} />} 
                    colorClass="purple"
                    trend="up"
                    trendValue="+8.1%"
                />
                <KPICard 
                    title="Total Products" 
                    value={stats?.totalProducts || 0} 
                    icon={<Package size={24} />} 
                    colorClass="primary"
                    trend="down"
                    trendValue="-2.3%"
                />
                <KPICard 
                    title="Total Customers" 
                    value={stats?.totalUsers || 0} 
                    icon={<Users size={24} />} 
                    colorClass="success"
                    trend="up"
                    trendValue="+5.7%"
                />
            </div>

            <div className={styles.chartsGrid}>
                <ChartCard 
                    title="Revenue Overview"
                    actions={
                        <div className={styles.chartTabs}>
                            {['Monthly', 'Weekly', 'Daily'].map((range) => (
                                <button 
                                    key={range}
                                    className={revenueTimeRange === range ? styles.tabActive : styles.tab}
                                    onClick={() => setRevenueTimeRange(range)}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    }
                >
                    <RevenueChart 
                        data={stats?.charts?.revenueOverview} 
                        timeRange={revenueTimeRange}
                    />
                </ChartCard>
                
                <ChartCard title="Sales by Category">
                    <SalesPieChart data={[
                        { name: 'Serums', value: 35 },
                        { name: 'Creams', value: 25 },
                        { name: 'Sunscreen', value: 20 },
                        { name: 'Oils', value: 10 },
                        { name: 'Toners', value: 7 },
                        { name: 'Other', value: 3 }
                    ]} />
                </ChartCard>
            </div>

            <div className={styles.fullWidthChart}>
                <ChartCard title="Orders Volume">
                    <OrdersChart />
                </ChartCard>
            </div>

            <div className={styles.recentOrdersGrid}>
                <ChartCard 
                    title="Recent Orders"
                    actions={
                        <button className={styles.viewAllBtn}>
                            <span>View All</span>
                            <ArrowUpRight size={14} />
                        </button>
                    }
                >
                    <div className={styles.tableScrollWrapper}>
                        {stats?.recentOrders?.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid var(--admin-border)', color: 'var(--admin-text-muted)' }}>
                                        <th style={{ padding: '12px 0 12px 1rem', fontWeight: 500 }}>ORDER ID</th>
                                        <th style={{ padding: '12px 0', fontWeight: 500 }}>PRODUCT</th>
                                        <th style={{ padding: '12px 0', fontWeight: 500 }}>CUSTOMER</th>
                                        <th style={{ padding: '12px 0', fontWeight: 500 }}>STATUS</th>
                                        <th style={{ padding: '12px 0', fontWeight: 500 }}>AMOUNT</th>
                                        <th style={{ padding: '12px 1rem', fontWeight: 500 }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--admin-border)', cursor: 'pointer' }} className={styles.orderRow}>
                                            <td style={{ padding: '12px 0 12px 1rem', fontWeight: 500, color: '#60A5FA' }}>#{order._id?.substring(0,8).toUpperCase()}</td>
                                            <td style={{ padding: '12px 0', color: 'var(--admin-text-muted)' }}>Product</td>
                                            <td style={{ padding: '12px 0', color: 'var(--admin-text-muted)' }}>{order.user?.name || 'Guest'}</td>
                                            <td style={{ padding: '12px 0' }}>
                                                <div className={styles.statusBadge}>
                                                    <span className={`${styles.statusDot} ${styles[order.status] || styles.processing}`}></span>
                                                    <span style={{ textTransform: 'capitalize' }}>{order.status || 'processing'}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 0', fontWeight: 600, color: 'var(--admin-text-main)' }}>{formatCurrency(order.totalPrice)}</td>
                                            <td style={{ padding: '12px 1rem', textAlign: 'right' }}>
                                                <button className={styles.actionIconBtn}>
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ color: 'var(--admin-text-muted)', textAlign: 'center', padding: '2rem' }}>No recent orders</div>
                        )}
                    </div>
                </ChartCard>
            </div>
        </div>
    );
};

export default DashboardPage;
