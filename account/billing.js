// Billing page JavaScript
// Fetches and displays invoice data from the API

document.addEventListener('DOMContentLoaded', async () => {
  await loadInvoices();
});

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

    renderInvoices(invoices);
    updatePagination(invoices.length);
  } catch (error) {
    console.error('Error loading invoices:', error);
    showError(tableBody, 'Failed to load invoices. Make sure the API server is running.');
  }
}

function renderInvoices(invoices) {
  const tableBody = document.getElementById('invoices-table-body');

  tableBody.innerHTML = invoices.map(invoice => `
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

function updatePagination(total) {
  const paginationText = document.querySelector('.pagination-controls span');
  if (paginationText) {
    paginationText.textContent = `1-${total} of ${total}`;
  }
}
