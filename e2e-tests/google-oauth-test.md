# Google OAuth E2E Test Documentation for JobBooster

This document provides comprehensive test scenarios for Google OAuth authentication using MCP (Model Context Protocol) services, specifically Playwright for browser automation.

## Test Results Summary

✅ **Google OAuth Button Present**: The "Sign in with Google" button is correctly displayed in the authentication modal  
✅ **OAuth Flow Initiation**: Clicking the Google button correctly initiates the OAuth flow  
✅ **Error Handling**: The application properly handles OAuth configuration errors  
❌ **Google Provider Not Enabled**: The Supabase project does not have Google OAuth provider enabled  

## Test Environment Setup

### Prerequisites
- MCP Playwright service running
- JobBooster application running on `http://localhost:3000`
- Wide screen resolution (1920x1080) for optimal testing
- Supabase project with Google OAuth provider configured

### MCP Services Used
- `mcp_playwright_browser_navigate` - Navigate to pages
- `mcp_playwright_browser_click` - Click elements
- `mcp_playwright_browser_snapshot` - Capture page state
- `mcp_playwright_browser_take_screenshot` - Visual verification
- `mcp_playwright_browser_console_messages` - Check logs
- `mcp_playwright_browser_wait_for` - Wait for conditions
- `mcp_playwright_browser_resize` - Set wide screen resolution

## Test Scenarios

### Scenario 1: Google OAuth Button Visibility

#### Objective
Verify that the Google OAuth button is present and properly styled in the authentication modal.

#### Steps
1. Navigate to `http://localhost:3000`
2. Click "Login" button in header
3. Verify "Sign in with Google" button is visible
4. Check button styling and layout on wide screen

#### Expected Results
- Google OAuth button is visible in the authentication modal
- Button displays "Continue with Google" text
- Button has proper Google branding (icon)
- Button is properly positioned above the email/password form
- Button works correctly on wide screen (1920x1080)

#### MCP Commands
```javascript
// Navigate to page
await mcp_playwright_browser_navigate({url: "http://localhost:3000"});

// Set wide screen resolution
await mcp_playwright_browser_resize({width: 1920, height: 1080});

// Click login button
await mcp_playwright_browser_click({element: "Login button", ref: "e125"});

// Take screenshot for verification
await mcp_playwright_browser_take_screenshot({filename: "google-oauth-button.png"});
```

### Scenario 2: Google OAuth Flow Initiation

#### Objective
Test that clicking the Google OAuth button correctly initiates the OAuth flow.

#### Steps
1. Open authentication modal
2. Click "Sign in with Google" button
3. Verify redirect to Google OAuth URL
4. Check OAuth parameters in URL

#### Expected Results
- Clicking Google button redirects to Supabase OAuth endpoint
- URL contains proper OAuth parameters:
  - `provider=google`
  - `redirect_to` parameter with callback URL
  - `code_challenge` and `code_challenge_method` for PKCE
- OAuth flow initiates correctly

#### MCP Commands
```javascript
// Click Google OAuth button
await mcp_playwright_browser_click({element: "Sign in with Google button", ref: "e158"});

// Wait for redirect
await mcp_playwright_browser_wait_for({time: 3});

// Check current URL and page state
await mcp_playwright_browser_snapshot({random_string: "oauth_redirect"});
```

### Scenario 3: OAuth Configuration Error Handling

#### Objective
Test how the application handles OAuth configuration errors.

#### Steps
1. Attempt Google OAuth with misconfigured provider
2. Verify error message display
3. Check application recovery

#### Expected Results
- OAuth error is properly displayed: `"Unsupported provider: provider is not enabled"`
- Error is shown in JSON format on the OAuth page
- Application can recover and return to normal state
- No critical errors in console logs

#### MCP Commands
```javascript
// Check error page
await mcp_playwright_browser_snapshot({random_string: "oauth_error"});

// Take screenshot of error
await mcp_playwright_browser_take_screenshot({filename: "google-oauth-error.png", fullPage: true});

// Navigate back to application
await mcp_playwright_browser_navigate({url: "http://localhost:3000"});

// Verify application recovery
await mcp_playwright_browser_wait_for({time: 3});
await mcp_playwright_browser_snapshot({random_string: "after_oauth_error"});
```

## Configuration Requirements

### 1. Supabase Configuration

#### Enable Google OAuth Provider
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable Google provider
3. Configure Google OAuth credentials

#### Required Supabase Settings
```bash
# In Supabase Dashboard
Authentication → Providers → Google
- Enable: ON
- Client ID: [Google OAuth Client ID]
- Client Secret: [Google OAuth Client Secret]
```

### 2. Google Cloud Console Configuration

#### Create OAuth 2.0 Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure authorized redirect URIs

#### Required Google OAuth Settings
```bash
# Authorized JavaScript origins
http://localhost:3000
https://yourdomain.com

# Authorized redirect URIs
https://kpznrvcsgsnjtxquulzs.supabase.co/auth/v1/callback
```

### 3. Environment Variables

#### Required Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://kpznrvcsgsnjtxquulzs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Google OAuth (Optional - handled by Supabase)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 4. Application Code Configuration

#### OAuth Action Configuration
The application already has the correct OAuth implementation in `src/app/auth/oauth/actions.ts`:

```typescript
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = await createClient()
  
  const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(redirectTo || '/')}`
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
    },
  })
  
  if (error) {
    return { error: error.message }
  }
  
  return { url: data.url }
}
```

#### Callback Route Configuration
The callback route in `src/app/auth/callback/route.ts` is properly configured to handle OAuth callbacks.

## Test Data

### Valid Test Scenarios
```json
{
  "oauth_flow": {
    "provider": "google",
    "redirect_url": "http://localhost:3000/auth/callback",
    "expected_flow": "redirect_to_google → user_consent → callback_to_app"
  }
}
```

### Error Test Scenarios
```json
{
  "configuration_errors": {
    "provider_not_enabled": "Unsupported provider: provider is not enabled",
    "invalid_client_id": "Invalid client ID",
    "invalid_redirect_uri": "Invalid redirect URI"
  }
}
```

## Expected Console Log Patterns

### Successful OAuth Initiation
```
[LOG] Google OAuth sign-in initiated
[LOG] Supabase client created for Google OAuth
[LOG] Initiating Google OAuth with Supabase
[LOG] Google OAuth initiated successfully
```

### OAuth Configuration Error
```
[ERROR] Failed to load resource: the server responded with a status of 400
[ERROR] {"code":400,"error_code":"validation_failed","msg":"Unsupported provider: provider is not enabled"}
```

## Visual Verification Points

### Screenshots to Capture
1. **Authentication Modal**: Shows Google OAuth button properly positioned
2. **OAuth Redirect**: Shows redirect to Supabase OAuth endpoint
3. **Configuration Error**: Shows error message when provider not enabled
4. **Application Recovery**: Shows application returns to normal state

### Element References
- Login Button: `ref="e125"`
- Google OAuth Button: `ref="e158"`
- Authentication Modal: `ref="e150"`

## Troubleshooting

### Common Issues
1. **Provider Not Enabled**: Enable Google provider in Supabase Dashboard
2. **Invalid Redirect URI**: Configure correct redirect URI in Google Cloud Console
3. **Missing Client ID**: Ensure Google OAuth credentials are properly configured
4. **CORS Issues**: Verify authorized origins in Google Cloud Console

### Debug Commands
```javascript
// Check current page state
await mcp_playwright_browser_snapshot({random_string: "debug"});

// Check console logs
await mcp_playwright_browser_console_messages({random_string: "debug"});

// Take screenshot
await mcp_playwright_browser_take_screenshot({filename: "debug.png", fullPage: true});

// Check URL parameters
await mcp_playwright_browser_evaluate({function: "() => { return window.location.href; }"});
```

## Test Execution Order

1. **Setup**: Navigate to page, resize browser to wide screen
2. **Button Visibility**: Verify Google OAuth button is present
3. **OAuth Initiation**: Test clicking Google button
4. **Error Handling**: Verify error handling for misconfigured provider
5. **Recovery**: Verify application recovers from OAuth errors
6. **Cleanup**: Close browser, reset state

## Success Criteria

- ✅ Google OAuth button is visible and properly styled
- ✅ Clicking button initiates OAuth flow correctly
- ✅ OAuth redirect URL contains proper parameters
- ✅ Error handling works for configuration issues
- ✅ Application recovers gracefully from OAuth errors
- ✅ All functionality works on wide screen resolution
- ✅ Console logs show proper OAuth flow initiation

## Next Steps for Full Implementation

1. **Enable Google Provider in Supabase**:
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google provider
   - Add Google OAuth credentials

2. **Configure Google Cloud Console**:
   - Create OAuth 2.0 credentials
   - Set authorized redirect URIs
   - Enable required APIs

3. **Test Complete OAuth Flow**:
   - Re-run tests after configuration
   - Test with real Google account
   - Verify user data retrieval

4. **Production Configuration**:
   - Update redirect URIs for production domain
   - Configure production environment variables
   - Test OAuth flow in production environment

## Maintenance Notes

- Update test data when OAuth configuration changes
- Adjust element references if UI changes
- Update expected console log patterns if logging changes
- Verify MCP service compatibility with new browser versions
- Test on different screen resolutions as needed
- Monitor OAuth success rates and error patterns
