# Supabase Email Templates Configuration

This directory contains the email templates and configuration files for Supabase authentication emails. The templates are designed to match your website's branding and styling.

## Files Overview

### Email Templates
- `confirmation-email-template.html` - Email template for user signup confirmation
- `reset-password-email-template.html` - Email template for password reset requests

### Configuration Files
- `confirmation-email-config.json` - Configuration for confirmation email
- `reset-password-email-config.json` - Configuration for password reset email

## Template Design

Both email templates use the same design system as your website:
- **Color Scheme**: Dark header (#0f172a) with white content area
- **Typography**: Arial font family for consistency
- **Layout**: 600px max-width container with rounded corners
- **Styling**: Clean, professional design with proper spacing and shadows

## Supabase Variables

The templates use the following Supabase-provided variables:

### Common Variables
- `{{ .SiteName }}` - Your site name
- `{{ .SiteURL }}` - Your site URL
- `{{ .Email }}` - User's email address
- `{{ .CurrentYear }}` - Current year for copyright

### Confirmation Email Specific
- `{{ .ConfirmationURL }}` - The confirmation link for email verification

### Reset Password Email Specific
- `{{ .ConfirmationURL }}` - The password reset link
- `{{ .SupportEmail }}` - Support email address

## Implementation in Supabase

### 1. Upload Templates to Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to Authentication > Email Templates
3. Upload the HTML templates for each email type

### 2. Configure Email Templates

#### Confirmation Email
- **Template Type**: Confirm signup
- **Subject**: `Confirm Your Signup - {{ .SiteName }}`
- **Body**: Use the content from `confirmation-email-template.html`

#### Password Reset Email
- **Template Type**: Reset password
- **Subject**: `Reset Your Password - {{ .SiteName }}`
- **Body**: Use the content from `reset-password-email-template.html`

### 3. Environment Variables

Make sure your Supabase project has the following environment variables configured:
- `SITE_NAME` - Your site name
- `SITE_URL` - Your site URL
- `SUPPORT_EMAIL` - Your support email address

## Customization

### Styling
The templates use inline CSS for maximum email client compatibility. To modify the design:

1. Edit the `<style>` section in the HTML templates
2. Maintain the same color scheme and layout structure
3. Test across different email clients

### Content
To modify the email content:

1. Edit the HTML content within the `<div class="content">` section
2. Keep the Supabase variables intact (e.g., `{{ .ConfirmationURL }}`)
3. Maintain the same structure for consistency

### Branding
To update branding elements:

1. **Logo**: Update the logo path in the `src` attribute
2. **Colors**: Modify the CSS color values in the `<style>` section
3. **Site Name**: The `{{ .SiteName }}` variable will be automatically replaced

## Testing

### Local Testing
1. Use the configuration JSON files to test template rendering
2. Replace Supabase variables with test values
3. Open the HTML files in a browser to preview

### Supabase Testing
1. Configure the templates in your Supabase dashboard
2. Test the signup and password reset flows
3. Verify emails are received with correct styling and content

## Security Considerations

- The confirmation link expires in 24 hours by default
- Password reset links are single-use and expire
- Templates include security notes for users
- No sensitive information is included in the email content

## Support

If you need to modify these templates or have questions about implementation:

1. Check the Supabase documentation for email templates
2. Test changes in a development environment first
3. Verify email delivery across different providers (Gmail, Outlook, etc.)

## File Structure

```
supabaseconfig/
├── README.md                              # This documentation
├── confirmation-email-template.html       # Confirmation email HTML
├── confirmation-email-config.json         # Confirmation email config
├── reset-password-email-template.html     # Reset password email HTML
└── reset-password-email-config.json      # Reset password email config
```

## Next Steps

1. Upload the HTML templates to your Supabase dashboard
2. Configure the email settings in Supabase
3. Test the email flows in your application
4. Monitor email delivery and user engagement
