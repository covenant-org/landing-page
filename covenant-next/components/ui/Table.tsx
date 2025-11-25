import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import styles from './Table.module.css';
import { cn } from '@/lib/utils';

// Table Container
interface TableProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        {children}
      </div>
    );
  }
);
Table.displayName = 'Table';

// Table Header
interface TableHeaderProps extends HTMLAttributes<HTMLDivElement> {
  columns: string;
}

const TableHeader = forwardRef<HTMLDivElement, TableHeaderProps>(
  ({ className, columns, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.header, className)}
        style={{ ...style, gridTemplateColumns: columns }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableHeader.displayName = 'TableHeader';

// Table Row
interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
  columns: string;
  clickable?: boolean;
}

const TableRow = forwardRef<HTMLDivElement, TableRowProps>(
  ({ className, columns, clickable = false, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.row, clickable && styles.clickable, className)}
        style={{ ...style, gridTemplateColumns: columns }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TableRow.displayName = 'TableRow';

// Table Cell
interface TableCellProps extends HTMLAttributes<HTMLDivElement> {}

const TableCell = forwardRef<HTMLDivElement, TableCellProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.cell, className)} {...props}>
        {children}
      </div>
    );
  }
);
TableCell.displayName = 'TableCell';

// Table Footer
interface TableFooterProps extends HTMLAttributes<HTMLDivElement> {}

const TableFooter = forwardRef<HTMLDivElement, TableFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(styles.footer, className)} {...props}>
        {children}
      </div>
    );
  }
);
TableFooter.displayName = 'TableFooter';

// Arrow Icon Component
function ArrowIcon() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export { Table, TableHeader, TableRow, TableCell, TableFooter, ArrowIcon };
export default Table;
