import React from 'react';
import { Eye, Edit } from 'lucide-react';
import styles from './OrderTable.module.css';

const OrderTable = ({ orders }) => {
    
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', { 
            style: 'currency', 
            currency: 'INR', 
            maximumFractionDigits: 0 
        }).format(amount || 0);
    };

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return styles.delivered;
            case 'shipped': return styles.shipped;
            case 'pending': return styles.pending;
            case 'cancelled': return styles.cancelled;
            default: return styles.pending;
        }
    };

    if (orders.length === 0) {
        return (
            <div className={styles.emptyState}>
                No orders found matching your search.
            </div>
        );
    }

    return (
        <div className={styles.tableContainer}>
            <table className={styles.orderTable}>
                <thead>
                    <tr>
                        <th>ORDER ID</th>
                        <th>PRODUCT</th>
                        <th>CUSTOMER</th>
                        <th>DATE</th>
                        <th>STATUS</th>
                        <th>AMOUNT</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>
                                <code className={styles.orderId}>
                                    #{order._id?.substring(order._id.length - 8).toUpperCase()}
                                </code>
                            </td>
                            <td>
                                <div className={styles.productCell}>
                                    {order.products ? order.products.map(i => i.name).join(', ') : 'Product'}
                                </div>
                            </td>
                            <td>
                                <div className={styles.customerName}>
                                    {order.user?.name || 'Unknown User'}
                                </div>
                            </td>
                            <td>
                                <div className={styles.dateCell}>
                                    {formatDate(order.createdAt)}
                                </div>
                            </td>
                            <td>
                                <span className={`${styles.statusBadge} ${getStatusStyle(order.orderStatus)}`}>
                                    {order.orderStatus || 'pending'}
                                </span>
                            </td>
                            <td>
                                <div className={styles.amount}>
                                    {formatCurrency(order.totalPrice)}
                                </div>
                            </td>
                            <td>
                                <div className={styles.actions}>
                                    <button className={styles.iconBtn} title="View Details">
                                        <Eye size={18} />
                                    </button>
                                    <button className={styles.iconBtn} title="Edit Order">
                                        <Edit size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
