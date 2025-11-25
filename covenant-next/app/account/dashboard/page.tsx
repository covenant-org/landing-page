import Link from 'next/link';
import { query, queryOne } from '@/lib/db';
import { User, Invoice } from '@/types';
import { formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

async function getOwnerUser(): Promise<User | null> {
  try {
    return await queryOne<User>('SELECT * FROM users WHERE is_owner = true LIMIT 1');
  } catch {
    return null;
  }
}

async function getBalanceDue(): Promise<number> {
  try {
    const invoices = await query<Invoice>(
      "SELECT SUM(balance_due) as total FROM invoices WHERE status = 'unpaid'"
    );
    return (invoices[0] as unknown as { total: number })?.total || 0;
  } catch {
    return 0;
  }
}

export default async function DashboardPage() {
  const [user, balanceDue] = await Promise.all([getOwnerUser(), getBalanceDue()]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Home</h1>
      <p className={styles.subHeader}>
        {user?.name || 'User'} • ACC-581805-31013-52
      </p>

      <div className={styles.grid}>
        {/* Balance Card */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <div className={styles.balanceHeader}>
            <span className={styles.balanceLabel}>Balance Due</span>
            <Link href="/account/billing" className={styles.btnPay}>
              Pay
            </Link>
          </div>
          <div className={styles.balanceAmount}>
            {formatCurrency(balanceDue)}
            {balanceDue === 0 && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
          </div>
        </div>

        {/* Subscriptions Card */}
        <Link href="/account/subscriptions" className={styles.card}>
          <div className={styles.actionCardContent}>
            <svg className={styles.cardIcon} viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <div className={styles.cardText}>
              <h3>Subscriptions</h3>
              <p>Manage Starlink service</p>
            </div>
          </div>
        </Link>

        {/* Orders Card */}
        <Link href="/account/orders" className={styles.card}>
          <div className={styles.actionCardContent}>
            <svg className={styles.cardIcon} viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <div className={styles.cardText}>
              <h3>Orders</h3>
              <p>View order history</p>
            </div>
          </div>
        </Link>

        {/* Billing Card */}
        <Link href="/account/billing" className={styles.card}>
          <div className={styles.actionCardContent}>
            <svg className={styles.cardIcon} viewBox="0 0 24 24">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <div className={styles.cardText}>
              <h3>Billing</h3>
              <p>View invoices and payments</p>
            </div>
          </div>
        </Link>

        {/* Devices Card */}
        <Link href="/account/devices" className={styles.card}>
          <div className={styles.actionCardContent}>
            <svg className={styles.cardIcon} viewBox="0 0 24 24">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            <div className={styles.cardText}>
              <h3>Devices</h3>
              <p>Manage hardware and connectivity</p>
            </div>
          </div>
        </Link>

        {/* Settings Card */}
        <Link href="/account/settings" className={styles.card}>
          <div className={styles.actionCardContent}>
            <svg className={styles.cardIcon} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <div className={styles.cardText}>
              <h3>Settings</h3>
              <p>Update profile and users</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
