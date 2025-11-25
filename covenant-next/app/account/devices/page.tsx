'use client';

import { useState, useEffect } from 'react';
import { Device, DeviceMetric, MetricTimeframe } from '@/types';
import { Button, StatusPill } from '@/components/ui';
import { formatUptime } from '@/lib/utils';
import styles from './page.module.css';

const TIMEFRAMES: { value: MetricTimeframe; label: string }[] = [
  { value: '15min', label: '15 min' },
  { value: '3hours', label: '3 hrs' },
  { value: '1day', label: '1 day' },
  { value: '7days', label: '7 days' },
  { value: '30days', label: '30 days' },
];

export default function DevicesPage() {
  const [device, setDevice] = useState<Device | null>(null);
  const [metrics, setMetrics] = useState<DeviceMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<MetricTimeframe>('15min');

  useEffect(() => {
    async function fetchDevice() {
      try {
        const res = await fetch('/api/devices');
        const devices = await res.json();
        if (devices.length > 0) {
          setDevice(devices[0]);
          // Fetch metrics for the first device
          const metricsRes = await fetch(`/api/devices/${devices[0].id}/metrics?timeframe=${timeframe}`);
          const metricsData = await metricsRes.json();
          setMetrics(metricsData);
        }
      } catch (error) {
        console.error('Error fetching device:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDevice();
  }, [timeframe]);

  // Calculate metrics averages
  const downloadSpeed = metrics.find(m => m.metric_type === 'download_speed')?.value || 0;
  const uploadSpeed = metrics.find(m => m.metric_type === 'upload_speed')?.value || 0;
  const latency = metrics.find(m => m.metric_type === 'latency')?.value || 0;
  const uptimePercent = metrics.find(m => m.metric_type === 'uptime_percent')?.value || 99.9;

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Devices</h1>
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  if (!device) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Devices</h1>
        <div className={styles.empty}>No devices found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Devices</h1>

      {/* Device Info Card */}
      <div className={styles.deviceCard}>
        <div className={styles.deviceHeader}>
          <div className={styles.deviceInfo}>
            <div className={styles.deviceIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <line x1="12" y1="20" x2="12.01" y2="20" />
              </svg>
            </div>
            <div>
              <h2 className={styles.deviceName}>{device.device_name || 'Starlink'}</h2>
              <span className={styles.deviceType}>{device.device_type}</span>
            </div>
          </div>
          <div className={styles.deviceStatus}>
            <div className={`${styles.statusDot} ${device.status === 'online' ? styles.online : ''}`} />
            <StatusPill status={device.status} />
          </div>
        </div>

        <div className={styles.deviceDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Starlink ID</span>
            <span className={styles.detailValue}>{device.starlink_id || '-'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Serial Number</span>
            <span className={styles.detailValue}>{device.serial_number || '-'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Kit Number</span>
            <span className={styles.detailValue}>{device.kit_number || '-'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Software Version</span>
            <span className={styles.detailValue}>{device.software_version || '-'}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Uptime</span>
            <span className={styles.detailValue}>{formatUptime(device.uptime_seconds)}</span>
          </div>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>Last Updated</span>
            <span className={styles.detailValue}>
              {device.last_updated ? new Date(device.last_updated).toLocaleString() : '-'}
            </span>
          </div>
        </div>

        <div className={styles.deviceActions}>
          <Button variant="outlined" size="sm">Reboot</Button>
          <Button variant="outlined" size="sm">Stow</Button>
          <Button variant="outlined" size="sm">Settings</Button>
        </div>
      </div>

      {/* Metrics Section */}
      <div className={styles.metricsSection}>
        <div className={styles.metricsHeader}>
          <h2>Performance Metrics</h2>
          <div className={styles.timeToggle}>
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.value}
                className={`${styles.timeOption} ${timeframe === tf.value ? styles.active : ''}`}
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Download</span>
              <span className={styles.metricValue}>{downloadSpeed} <small>Mbps</small></span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Upload</span>
              <span className={styles.metricValue}>{uploadSpeed} <small>Mbps</small></span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Latency</span>
              <span className={styles.metricValue}>{latency} <small>ms</small></span>
            </div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className={styles.metricInfo}>
              <span className={styles.metricLabel}>Uptime</span>
              <span className={styles.metricValue}>{uptimePercent} <small>%</small></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
