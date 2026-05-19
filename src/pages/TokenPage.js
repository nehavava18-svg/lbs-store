import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { cancelOrder } from '../services/firebaseApi';
import TokenDisplay from '../components/TokenDisplay';
import styles from './TokenPage.module.css';

const TokenPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // ✅ Expect both token (display) and orderId (Firestore doc id for cancel)
  const { token, orderId } = location.state || {};
  const [isCancelling, setIsCancelling] = useState(false);

  if (!token) {
    return <Navigate to="/store" replace />;
  }

  const handleCancelOrder = async () => {
    if (!orderId) {
      alert('Cannot cancel: order ID missing.');
      return;
    }
    const confirmed = window.confirm('Are you sure you want to cancel this order?');
    if (!confirmed) return;

    setIsCancelling(true);
    try {
      await cancelOrder(orderId); // ✅ use Firestore doc id, not token string
      alert(`Order ${token} cancelled successfully.`);
      navigate('/status');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.successIcon}>
          <div>OK</div>
        </div>

        <div className={styles.header}>
          <h1>Order Placed Successfully!</h1>
          <p>Your order has been received</p>
        </div>

        <div className={styles.tokenContainer}>
          <TokenDisplay token={token} label="Your Order Token" variant="success" />
        </div>

        <div className={styles.message}>
          <p><strong>Please wait for your turn</strong></p>
          <p className="text-muted">Keep this token number safe and monitor the status page</p>
        </div>

        <div className={styles.actions}>
          <button
            onClick={() => navigate('/status')}
            className={styles.primaryButton}
          >
            Track Order Status
          </button>
          <button
            onClick={handleCancelOrder}
            disabled={isCancelling}
            className={styles.secondaryButton}
            style={{ background: 'var(--color-danger)', color: 'white' }}
          >
            {isCancelling ? 'Cancelling...' : 'Cancel This Order'}
          </button>
          <button
            onClick={() => navigate('/store')} // ✅ /store not /
            className={styles.secondaryButton}
          >
            Browse More Items
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenPage;