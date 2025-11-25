// Subscriptions page JavaScript
// Fetches and displays subscription data from the API

// Pagination state
let currentSubsPage = 1;
let subsRowsPerPage = 10;
let allSubscriptions = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadSubscriptions();
});

async function loadSubscriptions() {
  const tableBody = document.getElementById('subscriptions-table-body');
  const paginationText = document.getElementById('subs-pagination-text');

  if (!tableBody) {
    console.error('Table body element not found');
    return;
  }

  showLoading(tableBody);

  try {
    allSubscriptions = await api.getSubscriptions();

    if (!allSubscriptions || allSubscriptions.length === 0) {
      tableBody.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #888; grid-column: 1 / -1;">
          No subscriptions found. Add your first subscription to get started.
        </div>
      `;
      paginationText.textContent = '0-0 of 0';
      return;
    }

    renderSubsPage();
  } catch (error) {
    console.error('Error loading subscriptions:', error);
    showError(tableBody, 'Failed to load subscriptions. Make sure the API server is running.');
  }
}

function renderSubsPage() {
  const tableBody = document.getElementById('subscriptions-table-body');
  const paginationText = document.getElementById('subs-pagination-text');

  const startIndex = (currentSubsPage - 1) * subsRowsPerPage;
  const endIndex = Math.min(startIndex + subsRowsPerPage, allSubscriptions.length);
  const subsToShow = allSubscriptions.slice(startIndex, endIndex);

  tableBody.innerHTML = subsToShow.map(sub => `
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

  // Update pagination text
  const total = allSubscriptions.length;
  paginationText.textContent = `${startIndex + 1}-${endIndex} of ${total}`;
}

function changeSubsRowsPerPage(value) {
  subsRowsPerPage = parseInt(value);
  currentSubsPage = 1;
  renderSubsPage();
}

function previousSubsPage() {
  if (currentSubsPage > 1) {
    currentSubsPage--;
    renderSubsPage();
  }
}

function nextSubsPage() {
  const totalPages = Math.ceil(allSubscriptions.length / subsRowsPerPage);
  if (currentSubsPage < totalPages) {
    currentSubsPage++;
    renderSubsPage();
  }
}
