'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Subscription } from '@/types';
import { Table, TableHeader, TableRow, TableCell, TableFooter, ArrowIcon, StatusPill, Pagination } from '@/components/ui';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;
const TABLE_COLUMNS = '2fr 2fr 1fr 40px';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const res = await fetch('/api/subscriptions');
        const data = await res.json();
        setSubscriptions(data);
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscriptions();
  }, []);

  const totalPages = Math.ceil(subscriptions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSubscriptions = subscriptions.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleRowClick = (id: string) => {
    router.push(`/account/subscriptions/${id}`);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Subscriptions</h1>
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Subscriptions</h1>

      <Table>
        <TableHeader columns={TABLE_COLUMNS}>
          <TableCell>Subscription</TableCell>
          <TableCell>Nickname</TableCell>
          <TableCell>Status</TableCell>
          <TableCell></TableCell>
        </TableHeader>

        {paginatedSubscriptions.map((subscription) => (
          <TableRow
            key={subscription.id}
            columns={TABLE_COLUMNS}
            clickable
            onClick={() => handleRowClick(subscription.id)}
          >
            <TableCell>{subscription.subscription_number}</TableCell>
            <TableCell>{subscription.nickname || '-'}</TableCell>
            <TableCell>
              <StatusPill status={subscription.status} />
            </TableCell>
            <TableCell>
              <ArrowIcon />
            </TableCell>
          </TableRow>
        ))}

        {subscriptions.length === 0 && (
          <div className={styles.empty}>No subscriptions found</div>
        )}

        <TableFooter>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={subscriptions.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </TableFooter>
      </Table>
    </div>
  );
}
