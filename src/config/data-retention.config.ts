/**
 * Data Retention Configuration
 * 
 * This file contains the main configuration for data retention policies.
 * Modify these settings to adjust retention periods and policies.
 */

import { DataType, RETENTION_PERIODS } from '../lib/data-retention';

/**
 * Environment-specific retention configuration
 */
export const DATA_RETENTION_CONFIG = {
    // Enable/disable data retention system
    enabled: process.env.DATA_RETENTION_ENABLED === 'true' || false,

    // Dry run mode - don't actually delete data, just log what would be deleted
    dryRun: process.env.DATA_RETENTION_DRY_RUN === 'true' || false,

    // Batch size for processing records
    batchSize: parseInt(process.env.DATA_RETENTION_BATCH_SIZE || '100'),

    // Maximum records to process in one operation
    maxRecordsPerOperation: parseInt(process.env.DATA_RETENTION_MAX_RECORDS || '1000'),

    // Enable notifications before deletion
    enableNotifications: process.env.DATA_RETENTION_NOTIFICATIONS === 'true' || true,

    // Notification email settings
    notificationEmail: {
        from: process.env.DATA_RETENTION_EMAIL_FROM || 'noreply@jobbooster.com',
        subject: 'Data Deletion Notice - JobBooster',
        template: 'data-deletion-notice',
    },

    // Logging configuration
    logging: {
        level: process.env.DATA_RETENTION_LOG_LEVEL || 'info',
        enableAuditLog: process.env.DATA_RETENTION_AUDIT_LOG === 'true' || true,
        logRetentionDays: parseInt(process.env.DATA_RETENTION_LOG_RETENTION_DAYS || '90'),
    },

    // Schedule configuration (cron expressions)
    schedule: {
        // Run retention checks daily at 2 AM
        dailyCheck: process.env.DATA_RETENTION_DAILY_CRON || '0 2 * * *',
        // Run notification checks daily at 8 AM
        notificationCheck: process.env.DATA_RETENTION_NOTIFICATION_CRON || '0 8 * * *',
        // Run weekly cleanup on Sundays at 3 AM
        weeklyCleanup: process.env.DATA_RETENTION_WEEKLY_CRON || '0 3 * * 0',
    },

    // Data type specific overrides
    overrides: {
        // Override retention periods for specific data types
        [DataType.USER_PROFILE]: {
            retentionDays: process.env.USER_PROFILE_RETENTION_DAYS
                ? parseInt(process.env.USER_PROFILE_RETENTION_DAYS)
                : RETENTION_PERIODS.USER_PROFILE,
            notifyBeforeDeletion: process.env.USER_PROFILE_NOTIFY === 'true' || true,
            notificationDays: parseInt(process.env.USER_PROFILE_NOTIFICATION_DAYS || '30'),
        },

        [DataType.CV_DATA]: {
            retentionDays: process.env.CV_DATA_RETENTION_DAYS
                ? parseInt(process.env.CV_DATA_RETENTION_DAYS)
                : RETENTION_PERIODS.CV_DATA,
            notifyBeforeDeletion: process.env.CV_DATA_NOTIFY === 'true' || true,
            notificationDays: parseInt(process.env.CV_DATA_NOTIFICATION_DAYS || '14'),
        },

        [DataType.JOB_DATA]: {
            retentionDays: process.env.JOB_DATA_RETENTION_DAYS
                ? parseInt(process.env.JOB_DATA_RETENTION_DAYS)
                : RETENTION_PERIODS.JOB_DATA,
            notifyBeforeDeletion: process.env.JOB_DATA_NOTIFY === 'false' || false,
            notificationDays: 0,
        },

        [DataType.CONTACT_MESSAGES]: {
            retentionDays: process.env.CONTACT_MESSAGES_RETENTION_DAYS
                ? parseInt(process.env.CONTACT_MESSAGES_RETENTION_DAYS)
                : RETENTION_PERIODS.CONTACT_MESSAGES,
            notifyBeforeDeletion: process.env.CONTACT_MESSAGES_NOTIFY === 'false' || false,
            notificationDays: 0,
        },

        [DataType.NEWSLETTER_SUBSCRIPTIONS]: {
            retentionDays: process.env.NEWSLETTER_RETENTION_DAYS
                ? parseInt(process.env.NEWSLETTER_RETENTION_DAYS)
                : RETENTION_PERIODS.NEWSLETTER_SUBSCRIPTIONS,
            notifyBeforeDeletion: process.env.NEWSLETTER_NOTIFY === 'false' || false,
            notificationDays: 0,
        },
    },

    // Legal and compliance settings
    compliance: {
        // GDPR compliance mode
        gdprCompliant: process.env.GDPR_COMPLIANT === 'true' || true,

        // Data protection officer contact
        dpoContact: process.env.DPO_CONTACT || 'dpo@jobbooster.com',

        // Privacy policy URL
        privacyPolicyUrl: process.env.PRIVACY_POLICY_URL || '/privacy-policy',

        // Data retention policy URL
        retentionPolicyUrl: process.env.RETENTION_POLICY_URL || '/data-retention-policy',
    },

    // Notification templates
    templates: {
        dataDeletionNotice: {
            subject: 'Your data will be deleted soon - Action Required',
            html: `
        <h2>Data Deletion Notice</h2>
        <p>Dear {{userName}},</p>
        <p>This is to inform you that some of your data stored in JobBooster will be automatically deleted on {{deletionDate}} due to our data retention policy.</p>
        <p><strong>Data to be deleted:</strong></p>
        <ul>
          {{#each dataTypes}}
          <li>{{this.name}} - {{this.description}}</li>
          {{/each}}
        </ul>
        <p>If you wish to keep this data, please log in to your account and download it before the deletion date.</p>
        <p>If you have any questions, please contact us at {{supportEmail}}.</p>
        <p>Best regards,<br>The JobBooster Team</p>
      `,
            text: `
        Data Deletion Notice
        
        Dear {{userName}},
        
        This is to inform you that some of your data stored in JobBooster will be automatically deleted on {{deletionDate}} due to our data retention policy.
        
        Data to be deleted:
        {{#each dataTypes}}
        - {{this.name}}: {{this.description}}
        {{/each}}
        
        If you wish to keep this data, please log in to your account and download it before the deletion date.
        
        If you have any questions, please contact us at {{supportEmail}}.
        
        Best regards,
        The JobBooster Team
      `,
        },

        dataAnonymizationNotice: {
            subject: 'Your data has been anonymized',
            html: `
        <h2>Data Anonymization Notice</h2>
        <p>Dear {{userName}},</p>
        <p>Some of your data has been anonymized in accordance with our data retention policy. This means that personal identifiers have been removed while keeping the data for analytical purposes.</p>
        <p><strong>Anonymized data:</strong></p>
        <ul>
          {{#each dataTypes}}
          <li>{{this.name}} - {{this.description}}</li>
          {{/each}}
        </ul>
        <p>If you have any questions, please contact us at {{supportEmail}}.</p>
        <p>Best regards,<br>The JobBooster Team</p>
      `,
            text: `
        Data Anonymization Notice
        
        Dear {{userName}},
        
        Some of your data has been anonymized in accordance with our data retention policy. This means that personal identifiers have been removed while keeping the data for analytical purposes.
        
        Anonymized data:
        {{#each dataTypes}}
        - {{this.name}}: {{this.description}}
        {{/each}}
        
        If you have any questions, please contact us at {{supportEmail}}.
        
        Best regards,
        The JobBooster Team
      `,
        },
    },

    // Error handling and retry configuration
    errorHandling: {
        maxRetries: parseInt(process.env.DATA_RETENTION_MAX_RETRIES || '3'),
        retryDelayMs: parseInt(process.env.DATA_RETENTION_RETRY_DELAY_MS || '5000'),
        continueOnError: process.env.DATA_RETENTION_CONTINUE_ON_ERROR === 'true' || true,
    },

    // Performance and resource limits
    performance: {
        // Maximum processing time per operation (in minutes)
        maxProcessingTimeMinutes: parseInt(process.env.DATA_RETENTION_MAX_TIME_MINUTES || '30'),

        // Memory limit for batch processing (in MB)
        memoryLimitMB: parseInt(process.env.DATA_RETENTION_MEMORY_LIMIT_MB || '512'),

        // Database connection timeout (in seconds)
        dbTimeoutSeconds: parseInt(process.env.DATA_RETENTION_DB_TIMEOUT_SECONDS || '30'),
    },
} as const;

/**
 * Get configuration for a specific data type
 */
export function getDataTypeConfig(dataType: DataType) {
    const override = DATA_RETENTION_CONFIG.overrides[dataType];
    if (override) {
        return {
            retentionDays: override.retentionDays,
            notifyBeforeDeletion: override.notifyBeforeDeletion,
            notificationDays: override.notificationDays,
        };
    }

    // Return default configuration
    return {
        retentionDays: RETENTION_PERIODS[dataType],
        notifyBeforeDeletion: true,
        notificationDays: 30,
    };
}

/**
 * Check if data retention is enabled
 */
export function isDataRetentionEnabled(): boolean {
    return DATA_RETENTION_CONFIG.enabled;
}

/**
 * Check if dry run mode is enabled
 */
export function isDryRunMode(): boolean {
    return DATA_RETENTION_CONFIG.dryRun;
}

/**
 * Get batch size for processing
 */
export function getBatchSize(): number {
    return DATA_RETENTION_CONFIG.batchSize;
}

/**
 * Get maximum records per operation
 */
export function getMaxRecordsPerOperation(): number {
    return DATA_RETENTION_CONFIG.maxRecordsPerOperation;
}
