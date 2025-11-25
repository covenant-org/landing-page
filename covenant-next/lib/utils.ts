/**
 * Format a date to a readable string
 */
export function formatDate(date: string | Date | null): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date to ISO format (YYYY-MM-DD)
 */
export function formatDateISO(date: string | Date | null): string {
  if (!date) return '-';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Format currency to USD
 */
export function formatCurrency(amount: number | string | null): string {
  if (amount === null || amount === undefined) return '$0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(num);
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format uptime seconds to human readable string
 */
export function formatUptime(seconds: number): string {
  if (!seconds) return '0s';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);

  return parts.join(' ') || '0m';
}

/**
 * Capitalize first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Get status color class based on status string
 */
export function getStatusColor(status: string): 'active' | 'inactive' | 'pending' {
  const normalizedStatus = status?.toLowerCase();
  if (['active', 'paid', 'delivered', 'online', 'completed'].includes(normalizedStatus)) {
    return 'active';
  }
  if (['inactive', 'unpaid', 'cancelled', 'offline', 'failed'].includes(normalizedStatus)) {
    return 'inactive';
  }
  return 'pending';
}

/**
 * Truncate string to specified length
 */
export function truncate(str: string, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Classnames utility - combines class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
