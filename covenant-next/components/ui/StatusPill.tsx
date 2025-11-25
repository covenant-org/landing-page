import styles from './StatusPill.module.css';
import { cn, getStatusColor } from '@/lib/utils';

interface StatusPillProps {
  status: string;
  className?: string;
}

export default function StatusPill({ status, className }: StatusPillProps) {
  const colorClass = getStatusColor(status);

  return (
    <span className={cn(styles.pill, styles[colorClass], className)}>
      {status}
    </span>
  );
}
