# GDPR Compliance Components

This directory contains all the necessary components for GDPR compliance in your application.

## Components Overview

### 1. CookieConsentBanner.tsx
- **Purpose**: Displays a cookie consent banner on first visit
- **Features**: 
  - Granular cookie preferences (Essential, Analytics, Marketing, Preferences)
  - Accept All / Reject All / Customize options
  - Persistent storage of user choices
  - Responsive design

### 2. DataExportModal.tsx
- **Purpose**: Allows users to export their personal data (Right to Data Portability)
- **Features**:
  - Multiple export formats (JSON, CSV, PDF)
  - Progress tracking during export
  - Data type breakdown with size estimates
  - Error handling

### 3. ConsentManagement.tsx
- **Purpose**: Comprehensive consent management interface
- **Features**:
  - Cookie consent management
  - Notification preferences
  - Data processing consent
  - Real-time preference updates

### 4. DataDeletionModal.tsx
- **Purpose**: Handles data deletion requests (Right to be Forgotten)
- **Features**:
  - Granular deletion options
  - Deletion reason collection
  - Confirmation requirements
  - Progress tracking

### 5. GDPRProvider.tsx
- **Purpose**: Context provider for GDPR state management
- **Features**:
  - Global consent state
  - Automatic analytics/marketing initialization
  - Local storage management
  - API integration

## API Endpoints

### POST /api/gdpr/consent
Updates user consent preferences in the database.

**Request Body:**
```json
{
  "consent": {
    "essential": true,
    "analytics": false,
    "marketing": false,
    "preferences": false
  },
  "consentDate": "2024-01-20T10:00:00Z",
  "consentVersion": "1.0"
}
```

### POST /api/gdpr/export
Exports user data in specified format.

**Request Body:**
```json
{
  "format": "json" // or "csv" or "pdf"
}
```

### POST /api/gdpr/delete
Deletes user data based on specified options.

**Request Body:**
```json
{
  "deleteProfile": true,
  "deleteCvData": true,
  "deleteActivityLogs": true,
  "deleteCommunications": true,
  "deleteSessions": true,
  "reason": "User requested account deletion"
}
```

## Integration Steps

### 1. Add GDPR Provider to Root Layout

```tsx
// app/layout.tsx
import { GDPRProvider } from '@/components/gdpr/GDPRProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <GDPRProvider>
          {children}
        </GDPRProvider>
      </body>
    </html>
  )
}
```

### 2. Add Privacy Settings Link to Navigation

```tsx
// Add to your navigation component
<Link href="/privacy-settings">
  Privacy Settings
</Link>
```

### 3. Update Analytics Initialization

```tsx
// Only initialize analytics after consent
const { consent } = useGDPR()

useEffect(() => {
  if (consent?.analytics) {
    // Initialize Google Analytics, Mixpanel, etc.
    gtag('config', 'GA_MEASUREMENT_ID')
  }
}, [consent])
```

### 4. Update Marketing Tools

```tsx
// Only initialize marketing tools after consent
useEffect(() => {
  if (consent?.marketing) {
    // Initialize Facebook Pixel, etc.
    fbq('init', 'PIXEL_ID')
  }
}, [consent])
```

## Database Schema Requirements

Your Prisma schema should include these fields in the Profile model:

```prisma
model Profile {
  // ... existing fields
  
  // GDPR Compliance
  gdprConsent             Boolean  @default(false) @map("gdpr_consent")
  consentDate             DateTime? @map("consent_date")
  consentVersion          String?  @map("consent_version") @db.VarChar(20)
  retentionPolicy         String?  @map("retention_policy") @db.VarChar(100)
  
  // User preferences (JSON field)
  preferences             Json?
}
```

## Legal Pages Required

1. **Privacy Policy** (`/legal/privacy-policy`) - ✅ Already exists
2. **Terms of Service** (`/legal/terms-of-service`) - ✅ Already exists
3. **Cookie Policy** - Can be part of privacy policy
4. **Data Processing Agreement** - For B2B customers

## Testing Checklist

- [ ] Cookie banner appears on first visit
- [ ] Consent preferences are saved and persist
- [ ] Analytics only loads after consent
- [ ] Marketing tools only load after consent
- [ ] Data export works for all formats
- [ ] Data deletion removes all specified data
- [ ] Privacy settings page is accessible
- [ ] All API endpoints return correct responses
- [ ] Error handling works properly
- [ ] Mobile responsiveness is maintained

## Compliance Notes

- **Consent must be explicit and granular**
- **Users must be able to withdraw consent easily**
- **Data processing must be documented**
- **Data retention periods must be defined**
- **Users must be able to access, correct, and delete their data**
- **Data breaches must be reported within 72 hours**

## Customization

All components are fully customizable:
- Colors and styling match your design system
- Text content can be localized
- Consent categories can be modified
- Export formats can be extended
- Deletion options can be customized

## Support

For questions about GDPR compliance, consult:
- [GDPR Official Text](https://gdpr-info.eu/)
- [ICO GDPR Guidance](https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/)
- [CNIL GDPR Guide](https://www.cnil.fr/en/gdpr)
