# Data Retention System

This document describes the comprehensive data retention system implemented for GDPR compliance in the JobBooster application.

## Overview

The data retention system provides automated, policy-driven data deletion and anonymization capabilities to ensure compliance with GDPR requirements. It includes:

- **Configurable retention periods** for different data types
- **Automated deletion processes** with batch processing
- **User notification system** before data deletion
- **Anonymization capabilities** for data that can be kept in anonymized form
- **Comprehensive logging and audit trails**
- **Dry-run mode** for testing and validation

## Data Types and Retention Periods

| Data Type | Retention Period | Notification | Anonymization | Legal Basis |
|-----------|------------------|--------------|---------------|-------------|
| User Profile | 3 years | 30 days before | Yes | Legitimate interest |
| User Sessions | 30 days | No | No | Legitimate interest |
| User Activity | 2 years | No | Yes | Legitimate interest |
| CV Data | 2 years | 14 days before | No | Consent |
| Job Data | 1 year | No | Yes | Legitimate interest |
| CV Job Matches | 2 years | No | Yes | Consent |
| Generated Content | 2 years | 14 days before | No | Consent |
| Contact Messages | 1 year | No | No | Legitimate interest |
| Newsletter Subscriptions | Until unsubscribe | No | No | Consent |
| User Notifications | 90 days | No | No | Legitimate interest |
| Feature Usage | 2 years | No | Yes | Legitimate interest |
| Analytics Data | 2 years | No | Yes | Legitimate interest |
| Billing Records | 7 years | No | No | Legal obligation |
| Subscription Data | 7 years | No | No | Legal obligation |
| Security Logs | 1 year | No | No | Legitimate interest |
| Audit Logs | 7 years | No | No | Legal obligation |
| Failed Login Attempts | 90 days | No | No | Legitimate interest |

## Configuration

### Environment Variables

```bash
# Enable/disable data retention system
DATA_RETENTION_ENABLED=true

# Dry run mode (don't actually delete data)
DATA_RETENTION_DRY_RUN=false

# Batch processing settings
DATA_RETENTION_BATCH_SIZE=100
DATA_RETENTION_MAX_RECORDS=1000

# Notification settings
DATA_RETENTION_NOTIFICATIONS=true
DATA_RETENTION_EMAIL_FROM=noreply@jobbooster.com

# Logging settings
DATA_RETENTION_LOG_LEVEL=info
DATA_RETENTION_AUDIT_LOG=true
DATA_RETENTION_LOG_RETENTION_DAYS=90

# Data type specific overrides
USER_PROFILE_RETENTION_DAYS=1095
USER_PROFILE_NOTIFY=true
USER_PROFILE_NOTIFICATION_DAYS=30

CV_DATA_RETENTION_DAYS=730
CV_DATA_NOTIFY=true
CV_DATA_NOTIFICATION_DAYS=14

JOB_DATA_RETENTION_DAYS=365
JOB_DATA_NOTIFY=false

CONTACT_MESSAGES_RETENTION_DAYS=365
CONTACT_MESSAGES_NOTIFY=false

NEWSLETTER_RETENTION_DAYS=0
NEWSLETTER_NOTIFY=false

# Compliance settings
GDPR_COMPLIANT=true
DPO_CONTACT=dpo@jobbooster.com
PRIVACY_POLICY_URL=/privacy-policy
RETENTION_POLICY_URL=/data-retention-policy
```

### Cron Schedule

The system supports scheduled execution via cron expressions:

```bash
# Daily retention check at 2 AM
DATA_RETENTION_DAILY_CRON="0 2 * * *"

# Daily notification check at 8 AM
DATA_RETENTION_NOTIFICATION_CRON="0 8 * * *"

# Weekly cleanup on Sundays at 3 AM
DATA_RETENTION_WEEKLY_CRON="0 3 * * 0"
```

## Usage

### Basic Usage

```typescript
import { 
  getRetentionPolicy, 
  calculateDeletionDate, 
  isEligibleForDeletion,
  getEligibleRecords,
  calculateRetentionStats
} from '@/lib/data-retention';

// Get retention policy for a data type
const policy = getRetentionPolicy(DataType.USER_PROFILE);
console.log(`Retention period: ${policy.retentionDays} days`);

// Calculate deletion date
const deletionDate = calculateDeletionDate(DataType.CV_DATA, new Date('2023-01-01'));
console.log(`Data will be deleted on: ${deletionDate}`);

// Check if data is eligible for deletion
const isEligible = isEligibleForDeletion(DataType.JOB_DATA, new Date('2023-01-01'));
console.log(`Eligible for deletion: ${isEligible}`);

// Get eligible records for processing
const eligibleRecords = await getEligibleRecords(DataType.CV_DATA, prisma, 100);

// Calculate retention statistics
const stats = await calculateRetentionStats(DataType.USER_PROFILE, prisma);
console.log(`Total records: ${stats.totalRecords}`);
console.log(`Eligible for deletion: ${stats.eligibleForDeletion}`);
```

### Processing Data Retention

```typescript
import { 
  getEligibleRecords, 
  logRetentionOperation,
  createRetentionResult 
} from '@/lib/data-retention';

async function processDataRetention(dataType: DataType, prisma: any) {
  const context = {
    dataType,
    operation: 'delete' as const,
    dryRun: false,
    batchSize: 100,
  };

  try {
    // Get eligible records
    const records = await getEligibleRecords(dataType, prisma, 100);
    
    let processed = 0;
    let deleted = 0;
    let errors: string[] = [];

    // Process each record
    for (const record of records) {
      try {
        // Perform deletion logic here
        // await deleteRecord(record.id, dataType, prisma);
        deleted++;
      } catch (error) {
        errors.push(`Failed to delete record ${record.id}: ${error.message}`);
      }
      processed++;
    }

    // Log the operation
    const result = createRetentionResult(
      errors.length === 0,
      processed,
      deleted,
      0,
      errors
    );

    logRetentionOperation(context, result);
    return result;

  } catch (error) {
    const result = createRetentionResult(false, 0, 0, 0, [error.message]);
    logRetentionOperation(context, result);
    return result;
  }
}
```

### Sending Notifications

```typescript
import { getRecordsNeedingNotification } from '@/lib/data-retention';

async function sendDeletionNotifications(dataType: DataType, prisma: any) {
  const records = await getRecordsNeedingNotification(dataType, prisma, 100);
  
  for (const record of records) {
    // Send notification email to user
    await sendNotificationEmail({
      userId: record.id,
      dataType,
      deletionDate: record.deletionDate,
      notificationDate: record.notificationDate,
    });
  }
}
```

## Database Schema

The system works with existing database tables and adds retention tracking fields:

- `createdAt` - Record creation timestamp
- `lastAccessedAt` - Last access timestamp (for some data types)
- `deletedAt` - Soft deletion timestamp
- `isDeleted` - Soft deletion flag
- `deletedBy` - Who/what deleted the record

## Security and Compliance

### GDPR Compliance

- **Right to be forgotten**: Automated deletion of personal data
- **Data minimization**: Retention periods based on necessity
- **Transparency**: Clear retention policies and user notifications
- **Lawful basis**: Each data type has documented legal basis
- **Audit trails**: Comprehensive logging of all operations

### Security Features

- **Dry-run mode**: Test operations without affecting data
- **Batch processing**: Prevent system overload
- **Error handling**: Graceful failure with detailed logging
- **Access controls**: Admin-only access to retention operations
- **Audit logging**: Complete trail of all operations

## Monitoring and Maintenance

### Health Checks

```typescript
import { validateRetentionConfiguration, getDataRetentionSummary } from '@/lib/data-retention';

// Validate configuration
const validation = validateRetentionConfiguration();
if (!validation.valid) {
  console.error('Configuration errors:', validation.errors);
}

// Get system summary
const summary = await getDataRetentionSummary(prisma);
console.log('Retention summary:', summary);
```

### Logging

The system provides comprehensive logging at multiple levels:

- **Operation logs**: Each retention operation is logged
- **Error logs**: Detailed error information with context
- **Audit logs**: Compliance and security audit trails
- **Performance logs**: Processing times and resource usage

### Metrics

Key metrics to monitor:

- Records processed per operation
- Deletion success rate
- Notification delivery rate
- Processing time per batch
- Error rates by data type

## Troubleshooting

### Common Issues

1. **Configuration errors**: Check environment variables and validation
2. **Database connection issues**: Verify database connectivity and permissions
3. **Memory issues**: Reduce batch size or max records per operation
4. **Notification failures**: Check email configuration and templates

### Debug Mode

Enable debug logging:

```bash
DATA_RETENTION_LOG_LEVEL=debug
DATA_RETENTION_DRY_RUN=true
```

### Manual Operations

For critical data types requiring manual review:

```typescript
import { getDataTypesRequiringManualReview } from '@/lib/data-retention';

const manualReviewTypes = getDataTypesRequiringManualReview();
console.log('Data types requiring manual review:', manualReviewTypes);
```

## Future Enhancements

- **User dashboard**: Allow users to manage their data retention preferences
- **Advanced analytics**: Detailed retention analytics and reporting
- **API endpoints**: REST API for external system integration
- **Webhook support**: Real-time notifications for retention events
- **Custom policies**: User-defined retention policies for specific data
