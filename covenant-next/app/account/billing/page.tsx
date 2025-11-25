'use client';

import { useState, useEffect } from 'react';
import { Invoice, BillingInfo } from '@/types';
import { Table, TableHeader, TableRow, TableCell, TableFooter, StatusPill, Pagination, Button, Modal, Input, Select } from '@/components/ui';
import { formatDate, formatCurrency } from '@/lib/utils';
import styles from './page.module.css';

const ITEMS_PER_PAGE = 10;
const TABLE_COLUMNS = '1fr 1fr 1.2fr 2fr 0.8fr 1fr 1fr 0.8fr 40px';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // Billing info state
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);

  // Modals
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showCycleModal, setShowCycleModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [invoicesRes] = await Promise.all([
          fetch('/api/invoices'),
        ]);
        const invoicesData = await invoicesRes.json();
        setInvoices(invoicesData);
        setFilteredInvoices(invoicesData);

        // Mock billing info
        setBillingInfo({
          id: '1',
          user_id: '1',
          cardholder_name: 'Cristian Hernandez',
          card_last_four: '6985',
          card_type: 'mastercard',
          expiry_month: 12,
          expiry_year: 2029,
          billing_cycle_day: 27,
          available_credits: 0,
          is_primary: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === '') {
      applyFilters();
    } else {
      const query = searchQuery.toLowerCase();
      const searched = invoices.filter(inv =>
        inv.invoice_number.toLowerCase().includes(query)
      );
      setFilteredInvoices(searched);
      setCurrentPage(1);
    }
  }, [searchQuery]);

  const applyFilters = () => {
    let result = [...invoices];

    if (statusFilter) {
      result = result.filter(inv => inv.status === statusFilter);
    }
    if (paymentMethodFilter) {
      result = result.filter(inv => inv.payment_method === paymentMethodFilter);
    }

    setFilteredInvoices(result);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const resetFilters = () => {
    setStatusFilter('');
    setPaymentMethodFilter('');
    setFilteredInvoices(invoices);
    setCurrentPage(1);
    setShowFilterModal(false);
  };

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = filteredInvoices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Calculate totals
  const totalBalance = invoices.reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0);

  // Get billing cycle dates
  const getBillingCycleDates = () => {
    const now = new Date();
    const cycleDay = billingInfo?.billing_cycle_day || 27;

    let startDate = new Date(now.getFullYear(), now.getMonth(), cycleDay);
    if (now.getDate() < cycleDay) {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, cycleDay);
    }

    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(endDate.getDate() - 1);

    return {
      start: startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      end: endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
      due: startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
    };
  };

  const cycleDates = getBillingCycleDates();

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Billing</h1>
        <p className={styles.loading}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Billing</h1>
      <p className={styles.subtitle}>Manage your invoices and payments.</p>

      {/* Billing Grid */}
      <div className={styles.billingGrid}>
        {/* Balance Due Card */}
        <div className={styles.gridCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Balance Due</span>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setShowPaymentModal(true)}
              disabled={totalBalance === 0}
            >
              Pay
            </Button>
          </div>
          <div className={styles.balanceRow}>
            <span className={styles.balanceAmount}>{formatCurrency(totalBalance)}</span>
            {totalBalance === 0 && (
              <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            )}
          </div>
        </div>

        {/* Available Credits Card */}
        <div className={styles.gridCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Available Credits</span>
            <button
              className={styles.infoButton}
              onClick={() => setShowCreditsModal(true)}
              title="Credits info"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          </div>
          <div className={styles.creditsContent}>
            {/* Credits would be displayed here if any */}
          </div>
        </div>

        {/* Billing Cycle Card */}
        <div className={styles.gridCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Billing Cycle</span>
            <button
              className={styles.infoButton}
              onClick={() => setShowCycleModal(true)}
              title="Billing cycle info"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          </div>
          <div className={styles.cycleContent}>
            <p className={styles.cycleText}>Your billing period is {cycleDates.start} - {cycleDates.end}.</p>
            <p className={styles.cycleText}>Payment due {cycleDates.due}.</p>
          </div>
        </div>

        {/* Payment Method Card */}
        <div className={styles.gridCard}>
          <div className={styles.cardHeader}>
            <span className={styles.cardLabel}>Payment Method</span>
            <Button
              variant="outlined"
              size="sm"
              onClick={() => setShowEditPaymentModal(true)}
            >
              Edit
            </Button>
          </div>
          {billingInfo && (
            <div className={styles.paymentMethodContent}>
              <p className={styles.paymentName}>{billingInfo.cardholder_name}</p>
              <p className={styles.paymentCard}>
                {billingInfo.card_type === 'mastercard' ? 'MasterCard' :
                 billingInfo.card_type === 'visa' ? 'Visa' :
                 billingInfo.card_type === 'amex' ? 'American Express' :
                 billingInfo.card_type} ending in {billingInfo.card_last_four}
              </p>
              <p className={styles.paymentExpiry}>
                Expires: {billingInfo.expiry_month}/{billingInfo.expiry_year?.toString().slice(-2)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Invoices Section */}
      <div className={styles.invoicesSection}>
        <div className={styles.invoicesHeader}>
          <h2 className={styles.invoicesTitle}>Invoices</h2>
          <Button variant="outlined" size="sm">
            Preview Next Invoice
          </Button>
        </div>

        {/* Search and Filter Row */}
        <div className={styles.searchRow}>
          <div className={styles.searchInput}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by invoice number"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className={styles.filterButton}
            onClick={() => setShowFilterModal(true)}
            title="Filter"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="8" cy="6" r="2" fill="currentColor" />
              <circle cx="16" cy="12" r="2" fill="currentColor" />
              <circle cx="10" cy="18" r="2" fill="currentColor" />
            </svg>
          </button>
        </div>

        <Table>
          <TableHeader columns={TABLE_COLUMNS}>
            <TableCell>Date</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Invoice Number</TableCell>
            <TableCell>Method</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Balance Due</TableCell>
            <TableCell>Status</TableCell>
            <TableCell></TableCell>
          </TableHeader>

          {paginatedInvoices.map((invoice) => (
            <TableRow key={invoice.id} columns={TABLE_COLUMNS}>
              <TableCell>{formatDate(invoice.invoice_date)}</TableCell>
              <TableCell>{formatDate(invoice.due_date)}</TableCell>
              <TableCell>{invoice.description || 'Subscription'}</TableCell>
              <TableCell className={styles.invoiceNumber}>{invoice.invoice_number}</TableCell>
              <TableCell>{invoice.payment_method === 'credit_card' ? 'Card' : invoice.payment_method || 'Card'}</TableCell>
              <TableCell>{formatCurrency(invoice.total_amount)}</TableCell>
              <TableCell>{formatCurrency(invoice.balance_due)}</TableCell>
              <TableCell>
                <StatusPill status={invoice.status} />
              </TableCell>
              <TableCell>
                <button className={styles.downloadButton} title="Download invoice">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                </button>
              </TableCell>
            </TableRow>
          ))}

          {filteredInvoices.length === 0 && (
            <div className={styles.empty}>No invoices found</div>
          )}

          <TableFooter>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredInvoices.length}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </TableFooter>
        </Table>
      </div>

      {/* Filter Modal */}
      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filter Invoices"
      >
        <div className={styles.filterForm}>
          <Select
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: '', label: 'All' },
              { value: 'paid', label: 'Paid' },
              { value: 'unpaid', label: 'Unpaid' },
              { value: 'overdue', label: 'Overdue' },
            ]}
          />
          <Select
            label="Payment Method"
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            options={[
              { value: '', label: 'All' },
              { value: 'credit_card', label: 'Credit Card' },
              { value: 'bank_transfer', label: 'Bank Transfer' },
              { value: 'paypal', label: 'PayPal' },
            ]}
          />
          <div className={styles.filterActions}>
            <Button variant="ghost" onClick={resetFilters}>Reset</Button>
            <Button variant="solid" onClick={applyFilters}>Apply</Button>
          </div>
        </div>
      </Modal>

      {/* Payment Modal */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Make a Payment"
        size="lg"
      >
        <div className={styles.paymentForm}>
          <div className={styles.paymentSummary}>
            <span>Amount Due</span>
            <span className={styles.paymentAmountModal}>{formatCurrency(totalBalance)}</span>
          </div>

          <div className={styles.formGrid}>
            <Input label="Cardholder Name" placeholder="John Doe" />
            <Input label="Card Number" placeholder="1234 5678 9012 3456" />
            <Input label="Expiry Date" placeholder="MM/YY" />
            <Input label="CVV" placeholder="123" type="password" />
          </div>

          <div className={styles.paymentActions}>
            <Button variant="ghost" onClick={() => setShowPaymentModal(false)}>Cancel</Button>
            <Button variant="solid">Pay {formatCurrency(totalBalance)}</Button>
          </div>
        </div>
      </Modal>

      {/* Edit Payment Method Modal */}
      <Modal
        isOpen={showEditPaymentModal}
        onClose={() => setShowEditPaymentModal(false)}
        title="Edit Payment Method"
        size="lg"
      >
        <div className={styles.paymentForm}>
          <div className={styles.formGrid}>
            <Input label="Cardholder Name" placeholder="Cristian Hernandez" defaultValue={billingInfo?.cardholder_name || ''} />
            <Input label="Card Number" placeholder="**** **** **** 6985" />
            <Input label="Expiry Date" placeholder="12/29" defaultValue={billingInfo ? `${billingInfo.expiry_month}/${billingInfo.expiry_year?.toString().slice(-2)}` : ''} />
            <Input label="CVV" placeholder="***" type="password" />
          </div>

          <div className={styles.paymentActions}>
            <Button variant="ghost" onClick={() => setShowEditPaymentModal(false)}>Cancel</Button>
            <Button variant="solid">Save Changes</Button>
          </div>
        </div>
      </Modal>

      {/* Credits Info Modal */}
      <Modal
        isOpen={showCreditsModal}
        onClose={() => setShowCreditsModal(false)}
        title="Available Credits"
      >
        <div className={styles.helpContent}>
          <p>Credits can be applied to your account balance from refunds, promotions, or account adjustments.</p>
          <p>Available credits will be automatically applied to your next invoice.</p>
        </div>
      </Modal>

      {/* Billing Cycle Info Modal */}
      <Modal
        isOpen={showCycleModal}
        onClose={() => setShowCycleModal(false)}
        title="Billing Cycle"
      >
        <div className={styles.helpContent}>
          <p>Your billing cycle runs from the {billingInfo?.billing_cycle_day || 27}th of each month.</p>
          <p>Invoices are generated at the start of each billing cycle and payment is due on the same day.</p>
          <p>To change your billing cycle date, please contact support.</p>
        </div>
      </Modal>
    </div>
  );
}
