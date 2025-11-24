// Billing page JavaScript
// Fetches and displays invoice data from the API

let allInvoices = [];
let filteredInvoices = [];
let currentFilters = {
  status: 'all',
  sortBy: 'invoice_date',
  searchQuery: ''
};

// Pagination state
let currentPage = 1;
let rowsPerPage = 10;

document.addEventListener('DOMContentLoaded', async () => {
  await loadInvoices();
  setupEventListeners();
});

function setupEventListeners() {
  // Search input
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentFilters.searchQuery = e.target.value.toLowerCase();
      applyFiltersAndRender();
    });
  }

  // Filter button - toggle modal
  const filterBtn = document.querySelector('.filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', toggleFilterModal);
  }

  // Close modal when clicking outside
  const modal = document.getElementById('filter-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeFilterModal();
      }
    });
  }
}

async function loadInvoices() {
  const tableBody = document.getElementById('invoices-table-body');

  if (!tableBody) {
    console.error('Table body element not found');
    return;
  }

  showLoading(tableBody);

  try {
    const invoices = await api.getInvoices();

    if (!invoices || invoices.length === 0) {
      tableBody.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #888; grid-column: 1 / -1;">
          No invoices found.
        </div>
      `;
      return;
    }

    allInvoices = invoices;
    applyFiltersAndRender();
  } catch (error) {
    console.error('Error loading invoices:', error);
    showError(tableBody, 'Failed to load invoices. Make sure the API server is running.');
  }
}

function applyFiltersAndRender() {
  // Start with all invoices
  filteredInvoices = [...allInvoices];

  // Apply status filter
  if (currentFilters.status !== 'all') {
    filteredInvoices = filteredInvoices.filter(inv => inv.status === currentFilters.status);
  }

  // Apply comprehensive search filter
  if (currentFilters.searchQuery) {
    const query = currentFilters.searchQuery;
    filteredInvoices = filteredInvoices.filter(inv => {
      // Search across all text fields
      const searchableText = [
        inv.invoice_number,
        inv.description,
        inv.payment_method,
        inv.status,
        inv.user_name,
        inv.email,
        formatCurrency(inv.total_amount),
        formatCurrency(inv.balance_due),
        formatDate(inv.invoice_date),
        formatDate(inv.due_date)
      ].join(' ').toLowerCase();

      return searchableText.includes(query);
    });
  }

  // Apply sorting
  filteredInvoices.sort((a, b) => {
    if (currentFilters.sortBy === 'invoice_date') {
      return new Date(b.invoice_date) - new Date(a.invoice_date);
    } else if (currentFilters.sortBy === 'total_amount') {
      return b.total_amount - a.total_amount;
    }
    return 0;
  });

  // Reset to first page when filters change
  currentPage = 1;

  renderInvoices(filteredInvoices);
  updatePagination();
}

function renderInvoices(invoices) {
  const tableBody = document.getElementById('invoices-table-body');

  // Calculate pagination
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedInvoices = invoices.slice(startIndex, endIndex);

  if (paginatedInvoices.length === 0) {
    tableBody.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #888; grid-column: 1 / -1;">
        No invoices found matching your criteria.
      </div>
    `;
    return;
  }

  tableBody.innerHTML = paginatedInvoices.map(invoice => `
    <div class="table-row">
      <div>${formatDate(invoice.invoice_date)}</div>
      <div>${formatDate(invoice.due_date)}</div>
      <div>${invoice.description || '-'}</div>
      <div>${invoice.invoice_number}</div>
      <div>${invoice.payment_method || '-'}</div>
      <div style="text-align:right; padding-right:10px;">${formatCurrency(invoice.total_amount)}</div>
      <div style="text-align:right; padding-right:10px;">${formatCurrency(invoice.balance_due)}</div>
      <div style="text-align:center;">
        <span class="status-pill ${invoice.status === 'paid' ? 'status-active' : 'status-inactive'}">
          ${invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
        </span>
      </div>
      <div style="text-align:right;">
        <svg class="download-icon" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
      </div>
    </div>
  `).join('');

  // Add click handlers for download icons
  document.querySelectorAll('.download-icon').forEach((icon, index) => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('Download invoice:', invoices[index].invoice_number);
      // TODO: Implement download functionality
    });
  });
}

function updatePagination() {
  const total = filteredInvoices.length;
  const totalPages = Math.ceil(total / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage + 1;
  const endIndex = Math.min(currentPage * rowsPerPage, total);

  // Update pagination text
  const paginationText = document.querySelector('.pagination-controls span');
  if (paginationText) {
    paginationText.textContent = total > 0 ? `${startIndex}-${endIndex} of ${total}` : '0-0 of 0';
  }

  // Update arrow buttons
  const prevArrow = document.querySelectorAll('.page-arrow')[0];
  const nextArrow = document.querySelectorAll('.page-arrow')[1];

  if (prevArrow) {
    prevArrow.style.opacity = currentPage === 1 ? '0.3' : '1';
    prevArrow.style.cursor = currentPage === 1 ? 'default' : 'pointer';
  }

  if (nextArrow) {
    nextArrow.style.opacity = currentPage === totalPages ? '0.3' : '1';
    nextArrow.style.cursor = currentPage === totalPages ? 'default' : 'pointer';
  }
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    renderInvoices(filteredInvoices);
    updatePagination();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderInvoices(filteredInvoices);
    updatePagination();
  }
}

function changeRowsPerPage(value) {
  rowsPerPage = parseInt(value);
  currentPage = 1;
  renderInvoices(filteredInvoices);
  updatePagination();
}

function toggleFilterModal() {
  const modal = document.getElementById('filter-modal');
  if (modal) {
    const isShowing = modal.classList.toggle('show');
    if (isShowing) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
}

function closeFilterModal() {
  const modal = document.getElementById('filter-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

function applyFilters() {
  const statusSelect = document.getElementById('filter-status');
  const sortSelect = document.getElementById('filter-sort');

  if (statusSelect) {
    currentFilters.status = statusSelect.value;
  }
  if (sortSelect) {
    currentFilters.sortBy = sortSelect.value;
  }

  applyFiltersAndRender();
  closeFilterModal(); // This will also remove modal-open class
}

function resetFilters() {
  currentFilters = {
    status: 'all',
    sortBy: 'invoice_date',
    searchQuery: currentFilters.searchQuery // Keep search query
  };

  // Reset UI elements
  const statusSelect = document.getElementById('filter-status');
  const sortSelect = document.getElementById('filter-sort');

  if (statusSelect) statusSelect.value = 'all';
  if (sortSelect) sortSelect.value = 'invoice_date';

  applyFiltersAndRender();
}

// Payment Method Modal Functions
function openPaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
  // Reset form
  document.getElementById('payment-form').reset();
}

function formatCardNumber(value) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  // Add space every 4 digits
  return digits.replace(/(\d{4})/g, '$1 ').trim();
}

function formatExpiry(value) {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  // Add slash after 2 digits
  if (digits.length >= 2) {
    return digits.slice(0, 2) + '/' + digits.slice(2, 4);
  }
  return digits;
}

function savePaymentMethod(event) {
  event.preventDefault();

  const formData = {
    name: document.getElementById('card-name').value,
    rfc: document.getElementById('card-rfc').value,
    cardNumber: document.getElementById('card-number').value,
    cvc: document.getElementById('card-cvc').value,
    expiry: document.getElementById('card-expiry').value,
    zip: document.getElementById('card-zip').value
  };

  console.log('Payment method data:', formData);

  // TODO: Send to API
  // In a real application, you would send this to your backend API
  // api.updatePaymentMethod(formData).then(...)

  // For now, just show success and close modal
  alert('Payment method saved successfully!');
  closePaymentModal();
}

// Billing Cycle Help Modal Functions
function openBillingHelpModal() {
  const modal = document.getElementById('billing-help-modal');
  if (modal) {
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }
}

function closeBillingHelpModal() {
  const modal = document.getElementById('billing-help-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

// Credits Help Modal Functions
function openCreditsHelpModal() {
  const modal = document.getElementById('credits-help-modal');
  if (modal) {
    modal.classList.add('show');
    document.body.classList.add('modal-open');
  }
}

function closeCreditsHelpModal() {
  const modal = document.getElementById('credits-help-modal');
  if (modal) {
    modal.classList.remove('show');
    document.body.classList.remove('modal-open');
  }
}

// Add input formatters on page load
document.addEventListener('DOMContentLoaded', () => {
  // Card number formatting
  const cardNumberInput = document.getElementById('card-number');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      e.target.value = formatCardNumber(e.target.value);
    });
  }

  // Expiry date formatting
  const expiryInput = document.getElementById('card-expiry');
  if (expiryInput) {
    expiryInput.addEventListener('input', (e) => {
      e.target.value = formatExpiry(e.target.value);
    });
  }

  // CVC - only numbers
  const cvcInput = document.getElementById('card-cvc');
  if (cvcInput) {
    cvcInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '');
    });
  }

  // Close payment modal when clicking outside
  const paymentModal = document.getElementById('payment-modal');
  if (paymentModal) {
    paymentModal.addEventListener('click', (e) => {
      if (e.target === paymentModal) {
        closePaymentModal();
      }
    });
  }

  // Close billing help modal when clicking outside
  const billingHelpModal = document.getElementById('billing-help-modal');
  if (billingHelpModal) {
    billingHelpModal.addEventListener('click', (e) => {
      if (e.target === billingHelpModal) {
        closeBillingHelpModal();
      }
    });
  }

  // Close credits help modal when clicking outside
  const creditsHelpModal = document.getElementById('credits-help-modal');
  if (creditsHelpModal) {
    creditsHelpModal.addEventListener('click', (e) => {
      if (e.target === creditsHelpModal) {
        closeCreditsHelpModal();
      }
    });
  }
});
