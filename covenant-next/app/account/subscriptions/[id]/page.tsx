import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import { Subscription } from '@/types';
import { StatusPill, Button } from '@/components/ui';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getSubscription(id: string): Promise<Subscription | null> {
  try {
    return await queryOne<Subscription>(
      `SELECT s.*, u.name as user_name, u.email as user_email
       FROM subscriptions s
       LEFT JOIN users u ON s.user_id = u.id
       WHERE s.id = $1`,
      [id]
    );
  } catch {
    return null;
  }
}

export default async function SubscriptionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const subscription = await getSubscription(id);

  if (!subscription) {
    notFound();
  }

  const dataUsedPercent = subscription.monthly_data_gb > 0
    ? (Number(subscription.data_used_gb) / subscription.monthly_data_gb) * 100
    : 0;

  return (
    <div className={styles.container}>
      <Link href="/account/subscriptions" className={styles.backLink}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Subscriptions
      </Link>

      <h1 className={styles.title}>Subscription</h1>
      <p className={styles.subId}>{subscription.subscription_number}</p>

      <div className={styles.grid}>
        {/* Left Column - Subscription Details */}
        <div className={styles.card}>
          <div className={styles.rowItem}>
            <div className={styles.labelGroup}>
              <h3>Nickname</h3>
              <div className={styles.value}>{subscription.nickname || 'No nickname set'}</div>
            </div>
            <Button variant="outlined" size="sm">Edit</Button>
          </div>

          <div className={styles.rowItem}>
            <div className={styles.labelGroup}>
              <h3>
                Service Plan
                <StatusPill status={subscription.status} className={styles.statusInline} />
              </h3>
              <div className={styles.value}>{subscription.service_plan || 'Standard Plan'}</div>
            </div>
            <Button variant="outlined" size="sm">Manage</Button>
          </div>

          <div className={`${styles.rowItem} ${styles.noBorder}`}>
            <div className={styles.labelGroup}>
              <h3>IP Policy</h3>
              <div className={styles.value}>{subscription.ip_policy}</div>
            </div>
            <Button variant="outlined" size="sm">Edit</Button>
          </div>
        </div>

        {/* Right Column - Service Location */}
        <div className={styles.card}>
          <div className={`${styles.rowItem} ${styles.noBorder}`} style={{ paddingBottom: 0 }}>
            <div className={styles.labelGroup}>
              <h3>Service Location</h3>
              <div className={styles.value}>{subscription.service_location || 'Not specified'}</div>
            </div>
            <Button variant="outlined" size="sm">Edit</Button>
          </div>
          <div className={styles.mapContainer}>
            <div className={styles.mapPin} />
            <div className={styles.mapboxLogo}>
              <div className={styles.mapboxDot} />
              mapbox
            </div>
          </div>
        </div>

        {/* Data Section Header */}
        <h2 className={styles.sectionHeader}>Data</h2>

        {/* Data Usage Card */}
        <div className={styles.card}>
          <div className={`${styles.rowItem} ${styles.noBorder}`} style={{ display: 'block' }}>
            <div className={styles.labelGroup}>
              <h3>
                Monthly Data Usage
                <svg className={styles.infoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              </h3>
              <div className={styles.dataUsageMain}>
                {subscription.data_used_gb} GB / {subscription.monthly_data_gb} GB
              </div>
            </div>
            <div className={styles.progressContainer}>
              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${Math.min(dataUsedPercent, 100)}%` }}
                />
              </div>
            </div>
            <div className={styles.dataText}>
              Unused data expires at the end of your billing cycle on {formatDate(subscription.billing_cycle_end)}.
            </div>
          </div>

          <div className={styles.divider} />

          <div className={`${styles.rowItem} ${styles.noBorder}`}>
            <div className={styles.labelGroup} style={{ maxWidth: '80%' }}>
              <div className={styles.toggleLabel}>Automatic Top Up</div>
              <div className={styles.toggleDescription}>
                Automatically buy more data for this billing cycle whenever you run out.
                Unused data expires at the end of each billing cycle.
              </div>
            </div>
            <label className={styles.toggleSwitch}>
              <input type="checkbox" defaultChecked={subscription.auto_top_up} />
              <span className={styles.slider} />
            </label>
          </div>

          <div className={styles.rowItem}>
            <div className={styles.labelGroup}>
              <div className={styles.value} style={{ fontSize: '13px' }}>One Time Top Up</div>
            </div>
            <Button variant="outlined" size="sm">Add</Button>
          </div>

          <div className={`${styles.rowItem} ${styles.noBorder}`}>
            <div className={styles.labelGroup}>
              <div className={styles.value} style={{ fontSize: '13px' }}>Monthly Data</div>
            </div>
            <Button variant="outlined" size="sm">Edit</Button>
          </div>
        </div>

        {/* Data Chart Card */}
        <div className={styles.card}>
          <div className={styles.labelGroup}>
            <h3>Total Data Usage</h3>
            <div className={styles.value} style={{ fontSize: '18px' }}>{subscription.data_used_gb} GB</div>
          </div>
          <div className={styles.chartMonths}>
            Apr May Jun Jul Aug Sep <span>Oct - Nov</span>
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.chartGrid}>
              <div className={styles.chartGridLine} />
              <div className={styles.chartGridLine} />
              <div className={styles.chartGridLine} />
            </div>
            <div className={styles.chartYAxis}>
              <div>30 GB</div>
              <div>20 GB</div>
              <div>10 GB</div>
              <div>0 GB</div>
            </div>
            <div className={styles.chartBars}>
              {[40, 10, 15, 5, 12, 8, 25, 30, 15, 45, 20, 60, 5, 35, 55, 2, 18, 15, 22, 8].map((height, i) => (
                <div key={i} className={styles.chartBar} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>

          <div className={styles.chartLabels}>
            <span style={{ marginLeft: '30px' }}>Oct 27</span>
            <span>Nov 26</span>
          </div>

          <div className={styles.chartLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: 'var(--accent-blue-chart)' }} />
              <div>
                Local Priority
                <br />
                <span className={styles.legendMuted}>100 GB recurring</span>
                <br />
                <span className={styles.legendMuted}>{Number(subscription.data_used_gb) - 100} GB top up</span>
              </div>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: 'white' }} />
              <div>
                Other Data
                <br />
                <span className={styles.legendMuted}>0 GB Unlimited</span>
              </div>
            </div>
          </div>

          <div className={styles.chartDisclaimer}>
            Data usage is tracked in UTC time, which may differ from your local time.
            Refer to your statement for accurate billing information.
          </div>
        </div>
      </div>
    </div>
  );
}
