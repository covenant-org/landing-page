// Jest setup file
require('@testing-library/jest-dom');

// Mock window.alert
global.alert = jest.fn();

// Mock fetch for API calls
global.fetch = jest.fn();
