'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Order } from '@/types';
import { Table, TableHeader, TableRow, TableCell, TableFooter, ArrowIcon, StatusPill, Pagination } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;
const TABLE_COLUMNS = '1fr 1fr 2fr 1.5fr 1.5fr 1fr 1fr 1fr 40px';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch('/api/orders');
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = orders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleRowClick = (id: string) => {
    router.push(`/account/orders/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Orders</h1>
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Orders</h1>

      <Table>
        <TableHeader columns={TABLE_COLUMNS}>
          <TableCell>Order #</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Item</TableCell>
          <TableCell>Status</TableCell>
          <TableCell>Est. Delivery</TableCell>
          <TableCell>Tracking</TableCell>
          <TableCell>Total</TableCell>
          <TableCell></TableCell>
        </TableHeader>

        {paginatedOrders.map((order) => (
          <TableRow
            key={order.id}
            columns={TABLE_COLUMNS}
            clickable
            onClick={() => handleRowClick(order.id)}
          >
            <TableCell>{order.order_number}</TableCell>
            <TableCell>{formatDate(order.order_date)}</TableCell>
            <TableCell>{order.item_name || '-'}</TableCell>
            <TableCell>
              <StatusPill status={order.status} />
            </TableCell>
            <TableCell>{order.estimated_delivery ? formatDate(order.estimated_delivery) : '-'}</TableCell>
            <TableCell>
              {order.tracking_number && order.tracking_url ? (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.trackingLink}
                  onClick={(e) => e.stopPropagation()}
                >
                  {order.tracking_number}
                </a>
              ) : (
                <span className={styles.noTracking}>{order.tracking_number || '-'}</span>
              )}
            </TableCell>
            <TableCell>{formatCurrency(order.total_amount)}</TableCell>
            <TableCell>
              <ArrowIcon />
            </TableCell>
          </TableRow>
        ))}

        {orders.length === 0 && (
          <div className={styles.empty}>No orders found</div>
        )}

        <TableFooter>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={orders.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </TableFooter>
      </Table>
    </div>
  );
}
