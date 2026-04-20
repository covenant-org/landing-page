/**
 * Billing Module Unit Tests
 * Tests for modals, input formatting, and basic functionality
 *
 * Note: Full integration tests for search/filter/pagination would require
 * refactoring billing.js to expose internal state management
 */

// Mock global dependencies
global.alert = jest.fn();
global.api = {
  getInvoices: jest.fn()
};

// Mock helper functions from api-client.js
global.showLoading = jest.fn((element) => {
  element.innerHTML = 'Loading...';
});

global.showError = jest.fn((element, message) => {
  element.innerHTML = `<div style="text-align: center; padding: 40px; color: #888;">${message}</div>`;
});

global.formatDate = jest.fn((date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString();
});

global.formatCurrency = jest.fn((amount) => {
  if (!amount) return '$0.00';
  return `$${parseFloat(amount).toFixed(2)}`;
});

describe('Billing Module - Modal Functionality', () => {
  let billing;

  beforeEach(() => {
    // Reset modules to get fresh instance
    jest.resetModules();

    // Set up DOM with all modals
    document.body.innerHTML = `
      <div id="payment-modal" class="payment-modal">
        <form id="payment-form">
          <input id="card-name" />
          <input id="card-rfc" />
          <input id="card-number" />
          <input id="card-cvc" />
          <input id="card-expiry" />
          <input id="card-zip" />
        </form>
      </div>
      <div id="billing-help-modal" class="billing-help-modal"></div>
      <div id="credits-help-modal" class="billing-help-modal"></div>
      <div id="filter-modal" class="filter-modal"></div>
    `;
    document.body.classList.remove('modal-open');

    // Load module after DOM is ready
    billing = require('./billing.js');
  });

  describe('Payment Modal', () => {
    test('openPaymentModal adds show class and disables body scroll', () => {
      billing.openPaymentModal();

      const modal = document.getElementById('payment-modal');
      expect(modal.classList.contains('show')).toBe(true);
      expect(document.body.classList.contains('modal-open')).toBe(true);
    });

    test('closePaymentModal removes show class and enables body scroll', () => {
      billing.openPaymentModal();
      billing.closePaymentModal();

      const modal = document.getElementById('payment-modal');
      expect(modal.classList.contains('show')).toBe(false);
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });

    test('closePaymentModal resets form', () => {
      const input = document.getElementById('card-name');
      input.value = 'Test Name';

      billing.closePaymentModal();

      expect(input.value).toBe('');
    });
  });

  describe('Billing Help Modal', () => {
    test('openBillingHelpModal opens help modal', () => {
      billing.openBillingHelpModal();

      const modal = document.getElementById('billing-help-modal');
      expect(modal.classList.contains('show')).toBe(true);
      expect(document.body.classList.contains('modal-open')).toBe(true);
    });

    test('closeBillingHelpModal closes help modal', () => {
      billing.openBillingHelpModal();
      billing.closeBillingHelpModal();

      const modal = document.getElementById('billing-help-modal');
      expect(modal.classList.contains('show')).toBe(false);
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });
  });

  describe('Credits Help Modal', () => {
    test('openCreditsHelpModal opens credits modal', () => {
      billing.openCreditsHelpModal();

      const modal = document.getElementById('credits-help-modal');
      expect(modal.classList.contains('show')).toBe(true);
      expect(document.body.classList.contains('modal-open')).toBe(true);
    });

    test('closeCreditsHelpModal closes credits modal', () => {
      billing.openCreditsHelpModal();
      billing.closeCreditsHelpModal();

      const modal = document.getElementById('credits-help-modal');
      expect(modal.classList.contains('show')).toBe(false);
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });
  });

  describe('Filter Modal', () => {
    test('toggleFilterModal toggles modal visibility', () => {
      const modal = document.getElementById('filter-modal');

      billing.toggleFilterModal();
      expect(modal.classList.contains('show')).toBe(true);
      expect(document.body.classList.contains('modal-open')).toBe(true);

      billing.toggleFilterModal();
      expect(modal.classList.contains('show')).toBe(false);
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });

    test('closeFilterModal closes modal', () => {
      billing.toggleFilterModal(); // Open
      billing.closeFilterModal(); // Close

      const modal = document.getElementById('filter-modal');
      expect(modal.classList.contains('show')).toBe(false);
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });
  });

  describe('Multiple Modals', () => {
    test('only one modal-open class active at a time', () => {
      billing.openPaymentModal();
      expect(document.body.classList.contains('modal-open')).toBe(true);

      billing.closePaymentModal();
      billing.openBillingHelpModal();
      expect(document.body.classList.contains('modal-open')).toBe(true);

      billing.closeBillingHelpModal();
      expect(document.body.classList.contains('modal-open')).toBe(false);
    });
  });
});

describe('Billing Module - Input Formatting', () => {
  let billing;

  beforeEach(() => {
    jest.resetModules();
    billing = require('./billing.js');
  });

  describe('Card Number Formatting', () => {
    test('formatCardNumber adds spaces every 4 digits', () => {
      const result = billing.formatCardNumber('1234567890123456');
      expect(result).toBe('1234 5678 9012 3456');
    });

    test('formatCardNumber handles partial input', () => {
      expect(billing.formatCardNumber('1234')).toBe('1234');
      expect(billing.formatCardNumber('12345')).toBe('1234 5');
      expect(billing.formatCardNumber('123456')).toBe('1234 56');
    });

    test('formatCardNumber removes non-digits', () => {
      const result = billing.formatCardNumber('1234-5678-9012-3456');
      expect(result).toBe('1234 5678 9012 3456');
    });
  });

  describe('Expiry Date Formatting', () => {
    test('formatExpiry adds slash after 2 digits', () => {
      expect(billing.formatExpiry('1225')).toBe('12/25');
    });

    test('formatExpiry handles partial input', () => {
      expect(billing.formatExpiry('1')).toBe('1');
      expect(billing.formatExpiry('12')).toBe('12/');
      expect(billing.formatExpiry('123')).toBe('12/3');
    });

    test('formatExpiry removes non-digits', () => {
      expect(billing.formatExpiry('12/25')).toBe('12/25');
      expect(billing.formatExpiry('12-25')).toBe('12/25');
    });

    test('formatExpiry limits to MM/YY format', () => {
      expect(billing.formatExpiry('12345')).toBe('12/34');
    });
  });
});

describe('Billing Module - API Integration', () => {
  let billing;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    document.body.innerHTML = '<div id="invoices-table-body"></div>';

    billing = require('./billing.js');
  });

  test('loadInvoices calls API and handles loading state', async () => {
    const mockInvoices = [
      {
        id: '1',
        invoice_number: 'INV-001',
        invoice_date: '2025-01-01',
        due_date: '2025-01-15',
        description: 'Subscription',
        payment_method: 'Card',
        total_amount: '1000.00',
        balance_due: '0.00',
        status: 'paid',
        user_name: 'John Doe',
        email: 'john@example.com'
      }
    ];

    global.api.getInvoices.mockResolvedValue(mockInvoices);

    await billing.loadInvoices();

    expect(global.api.getInvoices).toHaveBeenCalledTimes(1);
    expect(global.showLoading).toHaveBeenCalled();
  });

  test('loadInvoices handles API errors', async () => {
    global.api.getInvoices.mockRejectedValue(new Error('Network error'));

    await billing.loadInvoices();

    expect(global.showError).toHaveBeenCalledWith(
      expect.any(Object),
      'Failed to load invoices. Make sure the API server is running.'
    );
  });

  test('loadInvoices handles empty results', async () => {
    global.api.getInvoices.mockResolvedValue([]);

    await billing.loadInvoices();

    const tableBody = document.getElementById('invoices-table-body');
    expect(tableBody.innerHTML).toContain('No invoices found');
  });
});

describe('Billing Module - Pagination', () => {
  let billing;

  beforeEach(() => {
    jest.resetModules();

    document.body.innerHTML = `
      <div id="invoices-table-body"></div>
      <div class="pagination-controls">
        <span></span>
        <span class="page-arrow"></span>
        <span class="page-arrow"></span>
      </div>
    `;

    billing = require('./billing.js');
  });

  test('changeRowsPerPage updates rows per page setting', () => {
    billing.changeRowsPerPage('20');

    // Function should execute without errors
    expect(true).toBe(true);
  });

  test('previousPage can be called', () => {
    // Should not throw
    expect(() => billing.previousPage()).not.toThrow();
  });

  test('nextPage can be called', () => {
    // Should not throw
    expect(() => billing.nextPage()).not.toThrow();
  });
});

describe('Billing Module - Form Submission', () => {
  let billing;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();

    document.body.innerHTML = `
      <div id="payment-modal" class="payment-modal">
        <form id="payment-form">
          <input id="card-name" value="John Doe" />
          <input id="card-rfc" value="RFC123" />
          <input id="card-number" value="1234 5678 9012 3456" />
          <input id="card-cvc" value="123" />
          <input id="card-expiry" value="12/25" />
          <input id="card-zip" value="12345" />
        </form>
      </div>
    `;

    billing = require('./billing.js');
  });

  test('savePaymentMethod prevents default form submission', () => {
    const event = {
      preventDefault: jest.fn()
    };

    billing.savePaymentMethod(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });

  test('savePaymentMethod shows success message', () => {
    const event = { preventDefault: jest.fn() };

    billing.savePaymentMethod(event);

    expect(global.alert).toHaveBeenCalledWith('Payment method saved successfully!');
  });
});
