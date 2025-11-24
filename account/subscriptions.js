// Subscriptions page JavaScript
// Fetches and displays subscription data from the API

document.addEventListener('DOMContentLoaded', async () => {
  await loadSubscriptions();
});

async function loadSubscriptions() {
  const tableBody = document.getElementById('subscriptions-table-body');

  if (!tableBody) {
    console.error('Table body element not found');
    return;
  }

  showLoading(tableBody);

  try {
    const subscriptions = await api.getSubscriptions();

    if (!subscriptions || subscriptions.length === 0) {
      tableBody.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #888; grid-column: 1 / -1;">
          No subscriptions found. Add your first subscription to get started.
        </div>
      `;
      return;
    }

    renderSubscriptions(subscriptions);
    updatePagination(subscriptions.length);
  } catch (error) {
    console.error('Error loading subscriptions:', error);
    showError(tableBody, 'Failed to load subscriptions. Make sure the API server is running.');
  }
}

function renderSubscriptions(subscriptions) {
  const tableBody = document.getElementById('subscriptions-table-body');

  tableBody.innerHTML = subscriptions.map(sub => `
    <div class="table-row" data-id="${sub.id}">
      <div class="cell-main">${sub.nickname || 'Unnamed Subscription'}</div>
      <div class="cell-sub">${sub.service_location || 'No location set'}</div>
      <div>
        <span class="status-pill ${sub.status === 'active' ? 'status-active' : 'status-inactive'}">
          ${sub.status}
        </span>
      </div>
      <div class="arrow-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </div>
    </div>
  `).join('');

  // Add click handlers to rows
  document.querySelectorAll('.table-row').forEach(row => {
    row.addEventListener('click', () => {
      window.location.href = 'detail-subs.html';
    });
  });
}

function updatePagination(total) {
  const paginationText = document.querySelector('.pagination-controls span');
  if (paginationText) {
    paginationText.textContent = `1-${total} of ${total}`;
  }
}
