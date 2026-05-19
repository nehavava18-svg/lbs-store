import React, { useState, useEffect } from 'react';
import { listenToOrders, markOrderServed, markOrderExpired } from '../services/firebaseApi';
import OrderTable from '../components/OrderTable';
import styles from './StaffDashboard.module.css';

const EXPIRY_MS = 10 * 60 * 1000; // 20 minutes in milliseconds

const StaffDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = listenToOrders(async (data) => {
      // Auto-expire any pending orders older than 20 minutes
      const now = Date.now();
      for (const order of data) {
        if (order.status === 'pending') {
          const createdAt = order.createdAt?.toDate?.() ?? new Date(order.createdAt ?? 0);
          if (now - createdAt.getTime() > EXPIRY_MS) {
            try {
              await markOrderExpired(order.id);
            } catch (err) {
              console.error('Failed to expire order:', order.id, err);
            }
          }
        }
      }

      const sortedOrders = [...data].sort((a, b) => {
        // Handle Firestore Timestamps (.toDate()) and plain dates safely
        const dateA = a.createdAt?.toDate?.() ?? new Date(a.createdAt ?? 0);
        const dateB = b.createdAt?.toDate?.() ?? new Date(b.createdAt ?? 0);
        return dateB - dateA;
      });

      setOrders(sortedOrders);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkServed = async (orderId) => {
    // orderId is the Firestore doc id, not the token string
    try {
      await markOrderServed(orderId);
    } catch (error) {
      console.error('Error marking order as served:', error);
      alert('Failed to update order status');
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'pending') return order.status === 'pending';
    if (filter === 'served') return order.status === 'served';
    if (filter === 'cancelled') return order.status === 'cancelled';
    if (filter === 'expired') return order.status === 'expired';
    return true;
  });

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const servedCount = orders.filter(o => o.status === 'served').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
  const expiredCount = orders.filter(o => o.status === 'expired').length;

  // Revenue only counts orders that are NOT cancelled or expired
  // i.e. revenue is counted when order is placed (pending or served)
  const totalRevenue = orders
    .filter(order => order.status !== 'cancelled' && order.status !== 'expired')
    .reduce((sum, order) => {
      const orderTotal = (order.items ?? []).reduce(
        (itemSum, item) => itemSum + (item.price * item.quantity),
        0
      );
      return sum + orderTotal;
    }, 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Order Management</h1>
          <p>View and manage customer orders</p>
        </div>

        <div className={styles.stats}>
          <div className={`${styles.statCard} ${styles.pending}`}>
            <span className={styles.statLabel}>Pending Orders</span>
            <div className={styles.statValue}>{pendingCount}</div>
          </div>

          <div className={`${styles.statCard} ${styles.served}`}>
            <span className={styles.statLabel}>Served Orders</span>
            <div className={styles.statValue}>{servedCount}</div>
          </div>

          <div className={`${styles.statCard} ${styles.revenue}`}>
            <span className={styles.statLabel}>Total Revenue</span>
            <div className={styles.statValue}>Rs {totalRevenue.toFixed(2)}</div>
          </div>
        </div>

        <div className={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`${styles.filterButton} ${filter === 'pending' ? styles.active : ''}`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('served')}
            className={`${styles.filterButton} ${filter === 'served' ? styles.active : ''}`}
          >
            Served ({servedCount})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`${styles.filterButton} ${filter === 'cancelled' ? styles.active : ''}`}
          >
            Cancelled ({cancelledCount})
          </button>
          <button
            onClick={() => setFilter('expired')}
            className={`${styles.filterButton} ${filter === 'expired' ? styles.active : ''}`}
          >
            Expired ({expiredCount})
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <OrderTable orders={filteredOrders} onMarkServed={handleMarkServed} />
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;