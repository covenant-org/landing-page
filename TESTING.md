# Testing Documentation

## Overview
This project uses Jest for frontend unit testing with a focus on the billing module functionality.

## Test Coverage

### Billing Module Tests (`account/billing.test.js`)

**25 tests covering:**

#### 1. Modal Functionality (10 tests)
- Payment method modal open/close
- Billing cycle help modal
- Credits help modal
- Filter modal
- Body scroll control when modals are active
- Form reset on modal close

#### 2. Input Formatting (7 tests)
- Card number formatting (spaces every 4 digits)
- Expiry date formatting (MM/YY)
- Non-digit character removal
- Partial input handling

#### 3. API Integration (3 tests)
- Successful API calls
- Error handling
- Empty result handling

#### 4. Pagination (3 tests)
- Rows per page configuration
- Page navigation
- Function availability

#### 5. Form Submission (2 tests)
- Form submission prevention
- Success message display

## Running Tests

### Local Development
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### CI/CD
Tests run automatically on:
- Push to `main`, `stage`, `account`, `claude` branches
- Pull requests to `main` or `stage` branches

The CI pipeline:
1. Runs tests on Node.js 18.x and 20.x
2. Generates coverage reports
3. Uploads coverage to Codecov
4. Comments test results on pull requests

## Current Coverage

```
File              | % Stmts | % Branch | % Funcs | % Lines
------------------|---------|----------|---------|--------
billing.js        |   57.52 |    40.19 |   54.05 |   58.24
```

## Test Structure

```
account/
├── billing.js          # Source code
└── billing.test.js     # Unit tests

.github/
└── workflows/
    └── test.yml        # CI/CD configuration

jest.config.js          # Jest configuration
jest.setup.js           # Test setup
package.json            # Dependencies and scripts
```

## Writing New Tests

### Example Test
```javascript
describe('Feature Name', () => {
  let billing;

  beforeEach(() => {
    jest.resetModules();
    document.body.innerHTML = '<!-- your HTML -->';
    billing = require('./billing.js');
  });

  test('should do something', () => {
    billing.someFunction();
    expect(something).toBe(expectedValue);
  });
});
```

### Best Practices
1. Reset modules between tests to avoid state pollution
2. Mock external dependencies (API calls, DOM elements)
3. Test one thing per test
4. Use descriptive test names
5. Clean up after tests (reset DOM, clear mocks)

## Mocked Dependencies

The following are mocked globally in tests:
- `api.getInvoices()` - API client
- `alert()` - Browser alert
- `showLoading()` - Loading state helper
- `showError()` - Error display helper
- `formatDate()` - Date formatting
- `formatCurrency()` - Currency formatting

## Future Improvements

1. **Increase Coverage**: Add tests for:
   - Search functionality with various queries
   - Filter combinations
   - Pagination edge cases

2. **Integration Tests**: Test full user workflows

3. **E2E Tests**: Add Playwright/Cypress for browser testing

4. **Performance Tests**: Measure render performance with large datasets

5. **Accessibility Tests**: Ensure WCAG compliance

## Troubleshooting

### Tests Failing Locally
```bash
# Clear Jest cache
npx jest --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Coverage Not Updating
```bash
# Remove coverage directory
rm -rf coverage

# Run tests again
npm test
```

## CI/CD Configuration

### GitHub Actions Workflow
Located at `.github/workflows/test.yml`

**Triggers:**
- Push to protected branches
- Pull requests

**Steps:**
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Run tests with coverage
5. Upload coverage reports
6. Comment results on PRs

### Adding New Branches to CI
Edit `.github/workflows/test.yml` and add branch names to:
```yaml
on:
  push:
    branches: [ main, stage, your-new-branch ]
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Codecov](https://codecov.io/)
