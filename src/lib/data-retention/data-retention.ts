/**
 * Data Retention Configuration
 * 
 * This module defines GDPR-compliant data retention policies for all data types
 * stored in the JobBooster application. Each data type has specific retention
 * periods based on legal requirements and business needs.
 */

// Data retention periods in days
export const RETENTION_PERIODS = {
    // User account data - 3 years after last activity
    USER_PROFILE: 3 * 365, // 3 years
    USER_SESSION: 30, // 30 days
    USER_ACTIVITY: 2 * 365, // 2 years

    // CV and job-related data - 2 years after last access
    CV_DATA: 2 * 365, // 2 years
    JOB_DATA: 1 * 365, // 1 year
    CV_JOB_MATCHES: 2 * 365, // 2 years
    GENERATED_CONTENT: 2 * 365, // 2 years

    // Communication data
    CONTACT_MESSAGES: 1 * 365, // 1 year
    NEWSLETTER_SUBSCRIPTIONS: 0, // Until unsubscribe (no automatic deletion)
    USER_NOTIFICATIONS: 90, // 90 days

    // Analytics and tracking data
    FEATURE_USAGE: 2 * 365, // 2 years
    ANALYTICS_DATA: 2 * 365, // 2 years

    // Billing and subscription data - 7 years for legal compliance
    BILLING_RECORDS: 7 * 365, // 7 years
    SUBSCRIPTION_DATA: 7 * 365, // 7 years

    // Security and audit data
    SECURITY_LOGS: 1 * 365, // 1 year
    AUDIT_LOGS: 7 * 365, // 7 years
    FAILED_LOGIN_ATTEMPTS: 90, // 90 days
} as const;

/**
 * Data types that require special handling for retention
 */
export enum DataType {
    // User data
    USER_PROFILE = 'USER_PROFILE',
    USER_SESSION = 'USER_SESSION',
    USER_ACTIVITY = 'USER_ACTIVITY',

    // Content data
    CV_DATA = 'CV_DATA',
    JOB_DATA = 'JOB_DATA',
    CV_JOB_MATCHES = 'CV_JOB_MATCHES',
    GENERATED_CONTENT = 'GENERATED_CONTENT',

    // Communication data
    CONTACT_MESSAGES = 'CONTACT_MESSAGES',
    NEWSLETTER_SUBSCRIPTIONS = 'NEWSLETTER_SUBSCRIPTIONS',
    USER_NOTIFICATIONS = 'USER_NOTIFICATIONS',

    // Analytics data
    FEATURE_USAGE = 'FEATURE_USAGE',
    ANALYTICS_DATA = 'ANALYTICS_DATA',

    // Billing data
    BILLING_RECORDS = 'BILLING_RECORDS',
    SUBSCRIPTION_DATA = 'SUBSCRIPTION_DATA',

    // Security data
    SECURITY_LOGS = 'SECURITY_LOGS',
    AUDIT_LOGS = 'AUDIT_LOGS',
    FAILED_LOGIN_ATTEMPTS = 'FAILED_LOGIN_ATTEMPTS',
}

/**
 * Retention policy configuration for each data type
 */
export interface RetentionPolicy {
    /** Data type identifier */
    dataType: DataType;
    /** Retention period in days */
    retentionDays: number;
    /** Whether to send notification before deletion */
    notifyBeforeDeletion: boolean;
    /** Days before deletion to send notification */
    notificationDays: number;
    /** Whether this data can be anonymized instead of deleted */
    allowAnonymization: boolean;
    /** Legal basis for retention (GDPR Article 6) */
    legalBasis: string;
    /** Description of the data and its purpose */
    description: string;
    /** Whether this data is critical and requires manual review */
    requiresManualReview: boolean;
}

/**
 * Complete retention policies configuration
 */
export const RETENTION_POLICIES: Record<DataType, RetentionPolicy> = {
    [DataType.USER_PROFILE]: {
        dataType: DataType.USER_PROFILE,
        retentionDays: RETENTION_PERIODS.USER_PROFILE,
        notifyBeforeDeletion: true,
        notificationDays: 30,
        allowAnonymization: true,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'User profile information including personal details, preferences, and account settings',
        requiresManualReview: false,
    },

    [DataType.USER_SESSION]: {
        dataType: DataType.USER_SESSION,
        retentionDays: RETENTION_PERIODS.USER_SESSION,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'User session data for authentication and security',
        requiresManualReview: false,
    },

    [DataType.USER_ACTIVITY]: {
        dataType: DataType.USER_ACTIVITY,
        retentionDays: RETENTION_PERIODS.USER_ACTIVITY,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: true,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'User activity logs and analytics for service improvement',
        requiresManualReview: false,
    },

    [DataType.CV_DATA]: {
        dataType: DataType.CV_DATA,
        retentionDays: RETENTION_PERIODS.CV_DATA,
        notifyBeforeDeletion: true,
        notificationDays: 14,
        allowAnonymization: false,
        legalBasis: 'Consent (Article 6(1)(a))',
        description: 'Uploaded CV files and extracted personal information',
        requiresManualReview: false,
    },

    [DataType.JOB_DATA]: {
        dataType: DataType.JOB_DATA,
        retentionDays: RETENTION_PERIODS.JOB_DATA,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: true,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'Job posting data and analysis results',
        requiresManualReview: false,
    },

    [DataType.CV_JOB_MATCHES]: {
        dataType: DataType.CV_JOB_MATCHES,
        retentionDays: RETENTION_PERIODS.CV_JOB_MATCHES,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: true,
        legalBasis: 'Consent (Article 6(1)(a))',
        description: 'CV to job matching results and analysis',
        requiresManualReview: false,
    },

    [DataType.GENERATED_CONTENT]: {
        dataType: DataType.GENERATED_CONTENT,
        retentionDays: RETENTION_PERIODS.GENERATED_CONTENT,
        notifyBeforeDeletion: true,
        notificationDays: 14,
        allowAnonymization: false,
        legalBasis: 'Consent (Article 6(1)(a))',
        description: 'AI-generated content like cover letters and CV optimizations',
        requiresManualReview: false,
    },

    [DataType.CONTACT_MESSAGES]: {
        dataType: DataType.CONTACT_MESSAGES,
        retentionDays: RETENTION_PERIODS.CONTACT_MESSAGES,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'Contact form submissions and customer inquiries',
        requiresManualReview: false,
    },

    [DataType.NEWSLETTER_SUBSCRIPTIONS]: {
        dataType: DataType.NEWSLETTER_SUBSCRIPTIONS,
        retentionDays: RETENTION_PERIODS.NEWSLETTER_SUBSCRIPTIONS,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Consent (Article 6(1)(a))',
        description: 'Newsletter subscription data - retained until unsubscribe',
        requiresManualReview: false,
    },

    [DataType.USER_NOTIFICATIONS]: {
        dataType: DataType.USER_NOTIFICATIONS,
        retentionDays: RETENTION_PERIODS.USER_NOTIFICATIONS,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'User notification history and preferences',
        requiresManualReview: false,
    },

    [DataType.FEATURE_USAGE]: {
        dataType: DataType.FEATURE_USAGE,
        retentionDays: RETENTION_PERIODS.FEATURE_USAGE,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: true,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'Feature usage analytics and statistics',
        requiresManualReview: false,
    },

    [DataType.ANALYTICS_DATA]: {
        dataType: DataType.ANALYTICS_DATA,
        retentionDays: RETENTION_PERIODS.ANALYTICS_DATA,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: true,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'General analytics and usage statistics',
        requiresManualReview: false,
    },

    [DataType.BILLING_RECORDS]: {
        dataType: DataType.BILLING_RECORDS,
        retentionDays: RETENTION_PERIODS.BILLING_RECORDS,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legal obligation (Article 6(1)(c))',
        description: 'Billing records and payment information for tax compliance',
        requiresManualReview: true,
    },

    [DataType.SUBSCRIPTION_DATA]: {
        dataType: DataType.SUBSCRIPTION_DATA,
        retentionDays: RETENTION_PERIODS.SUBSCRIPTION_DATA,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legal obligation (Article 6(1)(c))',
        description: 'Subscription and billing data for legal compliance',
        requiresManualReview: true,
    },

    [DataType.SECURITY_LOGS]: {
        dataType: DataType.SECURITY_LOGS,
        retentionDays: RETENTION_PERIODS.SECURITY_LOGS,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'Security logs and incident records',
        requiresManualReview: false,
    },

    [DataType.AUDIT_LOGS]: {
        dataType: DataType.AUDIT_LOGS,
        retentionDays: RETENTION_PERIODS.AUDIT_LOGS,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legal obligation (Article 6(1)(c))',
        description: 'Audit logs for compliance and security monitoring',
        requiresManualReview: true,
    },

    [DataType.FAILED_LOGIN_ATTEMPTS]: {
        dataType: DataType.FAILED_LOGIN_ATTEMPTS,
        retentionDays: RETENTION_PERIODS.FAILED_LOGIN_ATTEMPTS,
        notifyBeforeDeletion: false,
        notificationDays: 0,
        allowAnonymization: false,
        legalBasis: 'Legitimate interest (Article 6(1)(f))',
        description: 'Failed login attempt records for security monitoring',
        requiresManualReview: false,
    },
};

/**
 * Get retention policy for a specific data type
 */
export function getRetentionPolicy(dataType: DataType): RetentionPolicy {
    return RETENTION_POLICIES[dataType];
}

/**
 * Get all data types that require notification before deletion
 */
export function getDataTypesRequiringNotification(): DataType[] {
    return Object.values(RETENTION_POLICIES)
        .filter(policy => policy.notifyBeforeDeletion)
        .map(policy => policy.dataType);
}

/**
 * Get all data types that require manual review before deletion
 */
export function getDataTypesRequiringManualReview(): DataType[] {
    return Object.values(RETENTION_POLICIES)
        .filter(policy => policy.requiresManualReview)
        .map(policy => policy.dataType);
}

/**
 * Calculate the deletion date for a given data type and creation date
 */
export function calculateDeletionDate(
    dataType: DataType,
    createdAt: Date
): Date {
    const policy = getRetentionPolicy(dataType);
    const deletionDate = new Date(createdAt);
    deletionDate.setDate(deletionDate.getDate() + policy.retentionDays);
    return deletionDate;
}

/**
 * Calculate the notification date for a given data type and creation date
 */
export function calculateNotificationDate(
    dataType: DataType,
    createdAt: Date
): Date | null {
    const policy = getRetentionPolicy(dataType);
    if (!policy.notifyBeforeDeletion) {
        return null;
    }

    const notificationDate = new Date(createdAt);
    notificationDate.setDate(notificationDate.getDate() + policy.retentionDays - policy.notificationDays);
    return notificationDate;
}

/**
 * Check if a data record is eligible for deletion
 */
export function isEligibleForDeletion(
    dataType: DataType,
    createdAt: Date,
    lastAccessedAt?: Date
): boolean {
    const policy = getRetentionPolicy(dataType);
    const now = new Date();

    // Use last accessed date if available, otherwise use creation date
    const referenceDate = lastAccessedAt || createdAt;
    const deletionDate = calculateDeletionDate(dataType, referenceDate);

    return now >= deletionDate;
}

/**
 * Check if a data record should receive a deletion notification
 */
export function shouldSendDeletionNotification(
    dataType: DataType,
    createdAt: Date,
    lastAccessedAt?: Date
): boolean {
    const policy = getRetentionPolicy(dataType);
    if (!policy.notifyBeforeDeletion) {
        return false;
    }

    const now = new Date();
    const referenceDate = lastAccessedAt || createdAt;
    const notificationDate = calculateNotificationDate(dataType, referenceDate);

    if (!notificationDate) {
        return false;
    }

    // Check if we're within the notification window
    const deletionDate = calculateDeletionDate(dataType, referenceDate);
    return now >= notificationDate && now < deletionDate;
}

/**
 * Get summary of all retention policies for display purposes
 */
export function getRetentionPoliciesSummary() {
    return Object.values(RETENTION_POLICIES).map(policy => ({
        dataType: policy.dataType,
        retentionDays: policy.retentionDays,
        retentionYears: Math.round((policy.retentionDays / 365) * 10) / 10,
        notifyBeforeDeletion: policy.notifyBeforeDeletion,
        notificationDays: policy.notificationDays,
        allowAnonymization: policy.allowAnonymization,
        legalBasis: policy.legalBasis,
        description: policy.description,
        requiresManualReview: policy.requiresManualReview,
    }));
}
