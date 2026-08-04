import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Filter, Plus, Search } from 'lucide-react';
import OrderTable from '../../components/admin/Orders/OrderTable';
import styles from './OrdersPage.module.css';

const OrdersPage = () => {
    const { token } = useAdminAuth();
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');

    const statusTabs = ['All', 'Processing', 'Shipped', 'Delivered'];

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get('/api/orders', { headers }); // Adjusting to the route in server.js
            
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setOrders(data);
            setFilteredOrders(data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [token]);

    useEffect(() => {
        let result = orders;

        // Filter by Tab
        if (activeTab !== 'All') {
            result = result.filter(order => order.orderStatus?.toLowerCase() === activeTab.toLowerCase());
        }

        // Filter by Search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(order => 
                order._id.toLowerCase().includes(query) ||
                order.user?.name?.toLowerCase().includes(query) ||
                (order.products && order.products.some(item => item.name.toLowerCase().includes(query)))
            );
        }

        setFilteredOrders(result);
    }, [orders, searchQuery, activeTab]);

    return (
        <div className={`${styles.ordersPage} admin-fade-in-up`}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2>Orders</h2>
                    <p>Manage and track all customer orders.</p>
                </div>
                <div className={styles.headerActions}>
                    <button className={styles.btnGlass}>
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className={styles.btnPrimary}>
                        <Plus size={18} />
                        New Order
                    </button>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrap}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search orders..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className={styles.tabs}>
                    {statusTabs.map(tab => (
                        <button 
                            key={tab}
                            className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.tableCard}>
                {loading ? (
                    <div className={styles.loading}>Loading orders...</div>
                ) : (
                    <OrderTable orders={filteredOrders} />
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
