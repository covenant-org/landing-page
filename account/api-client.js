// Covenant API Client
// Simple JavaScript client for fetching data from the API

const API_BASE_URL = 'http://localhost:3001/api';

class CovenantAPI {
  // Generic fetch method
  async fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Fetch Error:', error);
      throw error;
    }
  }

  // Users
  async getUsers() {
    return this.fetch('/users');
  }

  async getUser(id) {
    return this.fetch(`/users/${id}`);
  }

  async createUser(userData) {
    return this.fetch('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.fetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.fetch(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Subscriptions
  async getSubscriptions() {
    return this.fetch('/subscriptions');
  }

  async getSubscription(id) {
    return this.fetch(`/subscriptions/${id}`);
  }

  async createSubscription(subData) {
    return this.fetch('/subscriptions', {
      method: 'POST',
      body: JSON.stringify(subData),
    });
  }

  async updateSubscription(id, subData) {
    return this.fetch(`/subscriptions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subData),
    });
  }

  async deleteSubscription(id) {
    return this.fetch(`/subscriptions/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders() {
    return this.fetch('/orders');
  }

  async getOrder(id) {
    return this.fetch(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.fetch('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async updateOrder(id, orderData) {
    return this.fetch(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orderData),
    });
  }

  async deleteOrder(id) {
    return this.fetch(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Invoices
  async getInvoices() {
    return this.fetch('/invoices');
  }

  async getInvoice(id) {
    return this.fetch(`/invoices/${id}`);
  }

  async createInvoice(invoiceData) {
    return this.fetch('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(id, invoiceData) {
    return this.fetch(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  }

  async deleteInvoice(id) {
    return this.fetch(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }

  // Devices
  async getDevices() {
    return this.fetch('/devices');
  }

  async getDevice(id) {
    return this.fetch(`/devices/${id}`);
  }

  async getDeviceMetrics(id, timeframe = '15min') {
    return this.fetch(`/devices/${id}/metrics?timeframe=${timeframe}`);
  }

  async createDevice(deviceData) {
    return this.fetch('/devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateDevice(id, deviceData) {
    return this.fetch(`/devices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  async deleteDevice(id) {
    return this.fetch(`/devices/${id}`, {
      method: 'DELETE',
    });
  }

  async addDeviceMetric(id, metricData) {
    return this.fetch(`/devices/${id}/metrics`, {
      method: 'POST',
      body: JSON.stringify(metricData),
    });
  }
}

// Create a singleton instance
const api = new CovenantAPI();

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

// Helper function to format currency
function formatCurrency(amount, currency = 'MX$') {
  if (amount === null || amount === undefined) return '-';
  return `${currency}${parseFloat(amount).toFixed(2)}`;
}

// Helper function to show loading state
function showLoading(containerElement) {
  if (containerElement) {
    containerElement.innerHTML = '<div style="text-align: center; padding: 40px; color: #888;">Loading...</div>';
  }
}

// Helper function to show error state
function showError(containerElement, message = 'Failed to load data') {
  if (containerElement) {
    containerElement.innerHTML = `<div style="text-align: center; padding: 40px; color: #ff5252;">${message}</div>`;
  }
}
