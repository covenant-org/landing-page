'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Order, OrderItem } from '@/types';
import { StatusPill, Button } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

export default function OrderSummaryPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/orders/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) {
      fetchOrder();
    }
  }, [params.id]);

  const copyOrderNumber = async () => {
    if (order?.order_number) {
      await navigator.clipboard.writeText(order.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <Link href="/account/orders" className={styles.backLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Orders
        </Link>
        <h1 className={styles.title}>Order Summary</h1>
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <Link href="/account/orders" className={styles.backLink}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Orders
        </Link>
        <h1 className={styles.title}>Order Summary</h1>
        <p className={styles.loading}>Order not found</p>
      </div>
    );
  }

  // Mock items if not present in database
  const orderItems: OrderItem[] = order.items || [
    {
      id: '1',
      name: order.item_name || 'Starlink Standard Actuated Kit',
      item_id: order.order_number ? `${order.order_number.toLowerCase().replace('ord-', '')}` : null,
      price: order.subtotal || (order.total_amount ? order.total_amount * 0.8 : 0),
      status: order.status,
      image_url: null,
    },
    {
      id: '2',
      name: 'Deposit',
      item_id: null,
      price: order.tax ? -order.tax : -(order.total_amount ? order.total_amount * 0.15 : 0),
      status: order.status,
      image_url: null,
    },
  ];

  const subtotal = order.subtotal || orderItems.reduce((sum, item) => sum + Math.abs(item.price), 0) * 0.7;
  const tax = order.tax || subtotal * 0.16;
  const shipping = order.shipping_cost || 1420;
  const total = order.total_amount || (subtotal + tax + shipping);

  return (
    <div className={styles.container}>
      <Link href="/account/orders" className={styles.backLink}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Orders
      </Link>

      <h1 className={styles.title}>Order Summary</h1>

      {/* Order Info Card */}
      <div className={styles.infoCard}>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Order Number</span>
            <div className={styles.orderNumberRow}>
              <span className={styles.value}>{order.order_number}</span>
              <button
                className={styles.copyButton}
                onClick={copyOrderNumber}
                title={copied ? 'Copied!' : 'Copy order number'}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Tracking Number</span>
            {order.tracking_number && order.tracking_url ? (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.trackingLink}
              >
                {order.tracking_number}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ) : (
              <span className={styles.value}>{order.tracking_number || '-'}</span>
            )}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Placed</span>
            <span className={styles.value}>{formatDate(order.order_date)}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>Status</span>
            <StatusPill status={order.status} />
          </div>
        </div>
      </div>

      {/* Shipping Address Card */}
      <div className={styles.addressCard}>
        <div className={styles.addressContent}>
          <span className={styles.label}>Shipping Address</span>
          <span className={styles.value}>
            {order.shipping_address || 'Mar mediterraneo 1118, Country club'}
          </span>
        </div>
        <button className={styles.infoButton} title="Address info">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </button>
      </div>

      {/* Order Details Section */}
      <div className={styles.orderDetailsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Order Details</h2>
          <div className={styles.sectionActions}>
            <Button variant="outlined" size="sm">Return</Button>
            <Button variant="outlined" size="sm">Cancel</Button>
          </div>
        </div>

        <div className={styles.itemsCard}>
          {orderItems.map((item, index) => (
            <div key={item.id} className={`${styles.itemRow} ${index > 0 ? styles.itemBorder : ''}`}>
              <div className={styles.itemIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{item.name}</span>
                {item.item_id && (
                  <a href="#" className={styles.itemId}>{item.item_id}</a>
                )}
              </div>
              <div className={styles.itemPrice}>
                {formatCurrency(item.price)}
              </div>
              {item.name !== 'Deposit' && (
                <div className={styles.itemStatus}>
                  <StatusPill status={item.status} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary Card */}
      <div className={styles.paymentCard}>
        <span className={styles.label}>Payment Summary</span>

        <div className={styles.summaryRow}>
          <span>Items Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Tax</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className={`${styles.summaryRow} ${styles.totalRow}`}>
          <span>Order Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* FAQ Footer */}
      <p className={styles.faqText}>
        Questions about updating your order? See our <a href="/help/faq" className={styles.faqLink}>FAQ</a>.
      </p>
    </div>
  );
}
