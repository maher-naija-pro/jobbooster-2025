# E2E Test Documentation for JobBooster Authentication

This document provides comprehensive test scenarios for the JobBooster authentication system using MCP (Model Context Protocol) services, specifically Playwright for browser automation.

## Overview

The authentication system includes:
- Login form with email and password validation
- Loading animations during form submission
- Error handling for invalid credentials
- Success flow for valid credentials
- Responsive design testing on wide screens

## Test Environment Setup

### Prerequisites
- MCP Playwright service running
- JobBooster application running on `http://localhost:3000`
- Wide screen resolution (1920x1080) for optimal testing

### MCP Services Used
- `mcp_playwright_browser_navigate` - Navigate to pages
- `mcp_playwright_browser_click` - Click elements
- `mcp_playwright_browser_type` - Fill form fields
- `mcp_playwright_browser_snapshot` - Capture page state
- `mcp_playwright_browser_take_screenshot` - Visual verification
- `mcp_playwright_browser_console_messages` - Check logs
- `mcp_playwright_browser_evaluate` - Execute JavaScript
- `mcp_playwright_browser_wait_for` - Wait for conditions

## Test Scenarios

### Scenario 1: Form Validation Testing

#### Objective
Test client-side form validation for email and password fields.

#### Test Data
```json
{
  "invalid_email": "invalid-email",
  "valid_email": "test@example.com",
  "short_password": "short",
  "valid_password": "validpassword123"
}
```

#### Steps
1. Navigate to `http://localhost:3000`
2. Click "Login" button in header
3. Test invalid email format:
   - Type "invalid-email" in email field
   - Verify error message appears
4. Test short password:
   - Type "short" in password field
   - Verify error message appears
5. Test valid data:
   - Type "test@example.com" in email field
   - Type "validpassword123" in password field
   - Verify form shows "Form is valid!" in console
   - Verify "Sign In" button becomes enabled

#### Expected Results
- Email validation error: "Please enter a valid email address"
- Password validation error: "Password must be at least 8 characters"
- Form validation success: "Form is valid!" in console logs
- Button state: Disabled when invalid, enabled when valid

#### MCP Commands
```javascript
// Navigate to page
await mcp_playwright_browser_navigate({url: "http://localhost:3000"});

// Click login button
await mcp_playwright_browser_click({element: "Login button", ref: "e119"});

// Test invalid email
await mcp_playwright_browser_type({element: "Email textbox", ref: "e162", text: "invalid-email"});

// Test invalid password
await mcp_playwright_browser_type({element: "Password textbox", ref: "e165", text: "short"});

// Test valid data
await mcp_playwright_browser_type({element: "Email textbox", ref: "e162", text: "test@example.com"});
await mcp_playwright_browser_type({element: "Password textbox", ref: "e165", text: "validpassword123"});

// Check console logs
await mcp_playwright_browser_console_messages({random_string: "console"});
```

### Scenario 2: Loading Animation Testing

#### Objective
Verify that loading animations work correctly during form submission.

#### Test Data
```json
{
  "test_email": "test@example.com",
  "test_password": "testpassword123"
}
```

#### Steps
1. Fill form with valid test data
2. Click "Sign In" button
3. Observe loading state changes
4. Check console logs for loading state transitions

#### Expected Results
- Button shows loading state: `{isLoading: true, isFormValid: true, disabled: true}`
- Loading spinner appears in button
- Button text may change to "Signing In..." or similar
- Console logs show loading state transitions

#### MCP Commands
```javascript
// Fill form
await mcp_playwright_browser_type({element: "Email textbox", ref: "e162", text: "test@example.com"});
await mcp_playwright_browser_type({element: "Password textbox", ref: "e165", text: "testpassword123"});

// Click submit
await mcp_playwright_browser_click({element: "Sign In button", ref: "e175"});

// Check loading state
await mcp_playwright_browser_console_messages({random_string: "console"});
```

### Scenario 3: Error Handling Testing

#### Objective
Test error handling with invalid credentials.

#### Test Data
```json
{
  "fake_email": "fake@invalid.com",
  "fake_password": "wrongpassword"
}
```

#### Steps
1. Fill form with fake credentials
2. Click "Sign In" button
3. Wait for error response
4. Verify error message display
5. Check button state reset

#### Expected Results
- Server returns 500 Internal Server Error
- Error message appears: "Authentication Error: The email or password you entered is incorrect. Please check your credentials and try again."
- Button returns to enabled state
- Form remains filled for retry

#### MCP Commands
```javascript
// Fill with fake data
await mcp_playwright_browser_type({element: "Email textbox", ref: "e162", text: "fake@invalid.com"});
await mcp_playwright_browser_type({element: "Password textbox", ref: "e165", text: "wrongpassword"});

// Submit form
await mcp_playwright_browser_click({element: "Sign In button", ref: "e175"});

// Wait for error
await mcp_playwright_browser_wait_for({time: 3});

// Check error message
await mcp_playwright_browser_snapshot({random_string: "snapshot"});
```

### Scenario 4: Successful Authentication Testing

#### Objective
Test successful login with valid credentials.

#### Test Data
```json
{
  "valid_email": "maher.naija@gmail.com",
  "valid_password": "Azerty1986!!"
}
```

#### Steps
1. Fill form with valid credentials
2. Click "Sign In" button
3. Wait for authentication
4. Verify successful login
5. Check UI state changes

#### Expected Results
- Authentication successful
- User profile appears in header
- Auth modal closes automatically
- Console shows: `LoginButton: User state changed: {user: [user-id], loading: false}`
- Header shows user name instead of "Login" button

#### MCP Commands
```javascript
// Fill with valid credentials
await mcp_playwright_browser_type({element: "Email textbox", ref: "e162", text: "maher.naija@gmail.com"});
await mcp_playwright_browser_type({element: "Password textbox", ref: "e165", text: "Azerty1986!!"});

// Submit form
await mcp_playwright_browser_click({element: "Sign In button", ref: "e175"});

// Wait for success
await mcp_playwright_browser_wait_for({time: 3});

// Verify success
await mcp_playwright_browser_snapshot({random_string: "snapshot"});
await mcp_playwright_browser_console_messages({random_string: "console"});
```

### Scenario 5: Wide Screen Responsiveness Testing

#### Objective
Test authentication form on wide screen resolution.

#### Test Data
Same as previous scenarios

#### Steps
1. Set browser resolution to 1920x1080
2. Run all previous test scenarios
3. Verify form layout and button width
4. Check responsive behavior

#### Expected Results
- Form displays correctly on wide screen
- Button takes full width of container
- No layout issues or overflow
- All functionality works as expected

#### MCP Commands
```javascript
// Set wide screen resolution
await mcp_playwright_browser_resize({width: 1920, height: 1080});

// Run all test scenarios
// ... (same commands as previous scenarios)
```

## Test Data Repository

### Valid Test Credentials
```json
{
  "production_user": {
    "email": "maher.naija@gmail.com",
    "password": "Azerty1986!!"
  },
  "test_user": {
    "email": "test@example.com",
    "password": "testpassword123"
  }
}
```

### Invalid Test Data
```json
{
  "invalid_emails": [
    "invalid-email",
    "test@",
    "@example.com",
    "test.example.com",
    ""
  ],
  "invalid_passwords": [
    "short",
    "1234567",
    "",
    "a".repeat(100)
  ]
}
```

## Expected Console Log Patterns

### Form Validation Logs
```
[LOG] Form validation check: {email: ..., password: ..., confirmPassword: ..., isLogin: true, ...}
[LOG] Form invalid: [reason] OR [LOG] Form is valid!
[LOG] MetaButton disabled state: {isLoading: false, isFormValid: [boolean], disabled: [boolean]}
```

### Authentication Logs
```
[LOG] Analytics Event: login_attempt {formType: login, timestamp: ...}
[LOG] MetaButton disabled state: {isLoading: true, isFormValid: true, disabled: true}
[ERROR] Failed to load resource: the server responded with a status of 500 (Internal Server Error)
[LOG] MetaButton disabled state: {isLoading: false, isFormValid: true, disabled: false}
```

### Success Logs
```
[LOG] LoginButton: User state changed: {user: [user-id], loading: false}
[LOG] handleDirectClose called
[LOG] handleAuthModalClose called
```

## Visual Verification Points

### Screenshots to Capture
1. **Initial State**: Login button in header, empty form
2. **Validation Errors**: Form with error messages
3. **Loading State**: Button with loading spinner
4. **Error State**: Form with error message displayed
5. **Success State**: User profile in header, modal closed

### Element References
- Login Button: `ref="e119"`
- Email Field: `ref="e162"`
- Password Field: `ref="e165"`
- Sign In Button: `ref="e175"`
- Error Message: `ref="e183"`

## Troubleshooting

### Common Issues
1. **Element not found**: Take fresh snapshot with `mcp_playwright_browser_snapshot`
2. **Form not validating**: Wait for validation with `mcp_playwright_browser_wait_for({time: 2})`
3. **Loading state not showing**: Check console logs for loading state transitions
4. **Authentication failing**: Verify credentials and server status

### Debug Commands
```javascript
// Get current page state
await mcp_playwright_browser_snapshot({random_string: "debug"});

// Check console logs
await mcp_playwright_browser_console_messages({random_string: "debug"});

// Take screenshot
await mcp_playwright_browser_take_screenshot({filename: "debug.png", fullPage: true});

// Execute custom JavaScript
await mcp_playwright_browser_evaluate({function: "() => { return document.querySelector('button[type=\"submit\"]').className; }"});
```

## Test Execution Order

1. **Setup**: Navigate to page, resize browser
2. **Validation**: Test form validation with invalid data
3. **Loading**: Test loading animation with valid data
4. **Error**: Test error handling with fake credentials
5. **Success**: Test successful authentication
6. **Cleanup**: Close browser, reset state

## Success Criteria

- ✅ All form validation works correctly
- ✅ Loading animations display during submission
- ✅ Error messages appear for invalid credentials
- ✅ Successful authentication updates UI state
- ✅ Form works correctly on wide screen resolution
- ✅ Console logs show proper state transitions
- ✅ No critical errors in authentication flow

## Maintenance Notes

- Update test data when credentials change
- Adjust element references if UI changes
- Update expected console log patterns if logging changes
- Verify MCP service compatibility with new browser versions
- Test on different screen resolutions as needed
