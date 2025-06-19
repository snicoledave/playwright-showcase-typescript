# OrangeHRM Playwright Test Suite

A clean and simple Playwright test automation suite for the OrangeHRM demo application.

## Overview

This project demonstrates automated testing of the OrangeHRM demo site using Playwright with TypeScript. The tests are designed to be easy to understand and maintain, focusing on the core login functionality.

## Test Site

- **URL**: https://opensource-demo.orangehrmlive.com/
- **Demo Credentials**: 
  - Username: `Admin`
  - Password: `admin123`

## Project Structure

```
src/
├── pages/                          # Page Object Models
│   ├── BasePage.ts                # Base page with common functionality
│   ├── OrangeHRMLoginPage.ts      # Login page object
│   └── OrangeHRMDashboardPage.ts  # Dashboard page object
├── tests/
│   └── orangehrm-login.spec.ts    # Login test scenarios
└── utils/
    └── orangeHRMTestData.ts       # Test data and credentials
```

## Test Scenarios

The login test suite covers:

1. **Successful Login** - Valid credentials login
2. **Invalid Credentials** - Error handling for wrong credentials
3. **Empty Username** - Validation when username is empty
4. **Empty Password** - Validation when password is empty
5. **Both Fields Empty** - Validation when both fields are empty
6. **Form Clearing** - Ability to clear and retry login
7. **Logout** - Complete login/logout flow

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

### Running Tests

#### Run all tests:
```bash
npm test
```

#### Run only login tests:
```bash
npm run test:login
```

#### Run tests in headed mode (see browser):
```bash
npm run test:headed
```

#### Run tests in debug mode:
```bash
npm run test:debug
```

#### Run tests on specific browsers:
```bash
npm run test:chrome    # Chrome only
npm run test:firefox   # Firefox only
npm run test:webkit    # Safari only
```

### Test Reports

After running tests, view the HTML report:
```bash
npm run report
```

### Development

#### Generate new test code:
```bash
npm run codegen
```

#### Lint code:
```bash
npm run lint
```

#### Format code:
```bash
npm run format
```

## Key Features

- **Simple Page Objects**: Clean and easy-to-understand page object models
- **Comprehensive Test Coverage**: Covers positive and negative login scenarios
- **Clear Test Data**: Well-organized test data with valid and invalid credentials
- **Easy to Extend**: Simple structure makes it easy to add new tests
- **Multiple Browser Support**: Tests run on Chrome, Firefox, and Safari
- **Detailed Reporting**: HTML reports with screenshots and traces on failures

## Test Data

The test suite uses predefined test data:

- **Valid Credentials**: Admin/admin123 (OrangeHRM demo credentials)
- **Invalid Scenarios**: Various combinations of wrong usernames/passwords
- **Empty Field Scenarios**: Testing form validation

## Configuration

The main configuration is in `playwright.config.ts`:

- **Base URL**: https://opensource-demo.orangehrmlive.com
- **Timeouts**: 15s action timeout, 30s navigation timeout
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Reports**: HTML, JSON, JUnit formats

## Troubleshooting

### Common Issues

1. **Tests failing due to slow loading**: The OrangeHRM demo site can be slow. Tests include appropriate waits.

2. **Element not found**: The site uses dynamic loading. Page objects include proper wait strategies.

3. **Network issues**: Tests include retry logic and appropriate timeouts.

### Getting Help

If tests are failing:

1. Run in headed mode to see what's happening: `npm run test:headed`
2. Use debug mode to step through tests: `npm run test:debug`
3. Check the HTML report for detailed failure information: `npm run report`

## Contributing

When adding new tests:

1. Follow the existing page object pattern
2. Add test data to the appropriate data file
3. Keep tests simple and focused on one scenario
4. Include appropriate assertions and waits
5. Add clear descriptions and comments

## License

ISC License