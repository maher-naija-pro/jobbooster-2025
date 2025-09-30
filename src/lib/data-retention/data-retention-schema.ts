/**
 * Data Retention Database Schema Extensions
 * 
 * This module defines the database schema extensions needed to support
 * data retention policies and automated deletion processes.
 */

import { DataType } from '../data-retention';

/**
 * Database table mapping for data retention tracking
 */
export const DATA_RETENTION_TABLES = {
    [DataType.USER_PROFILE]: 'Profile',
    [DataType.USER_SESSION]: 'UserSession',
    [DataType.USER_ACTIVITY]: 'UserActivity',
    [DataType.CV_DATA]: 'CvData',
    [DataType.JOB_DATA]: 'JobData',
    [DataType.CV_JOB_MATCHES]: 'CvJobMatch',
    [DataType.GENERATED_CONTENT]: 'GeneratedContent',
    [DataType.CONTACT_MESSAGES]: 'ContactMessage',
    [DataType.NEWSLETTER_SUBSCRIPTIONS]: 'Newsletter',
    [DataType.USER_NOTIFICATIONS]: 'UserNotification',
    [DataType.FEATURE_USAGE]: 'FeatureUsage',
    [DataType.ANALYTICS_DATA]: 'UserActivity', // Maps to UserActivity table
    [DataType.BILLING_RECORDS]: 'Profile', // Maps to Profile subscription data
    [DataType.SUBSCRIPTION_DATA]: 'Profile', // Maps to Profile subscription data
    [DataType.SECURITY_LOGS]: 'Profile', // Maps to Profile security fields
    [DataType.AUDIT_LOGS]: 'UserActivity', // Maps to UserActivity table
    [DataType.FAILED_LOGIN_ATTEMPTS]: 'Profile', // Maps to Profile security fields
} as const;

/**
 * Field mappings for different data types to their retention tracking fields
 */
export const RETENTION_FIELD_MAPPINGS = {
    [DataType.USER_PROFILE]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'lastLoginAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.USER_SESSION]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'lastActivity',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.USER_ACTIVITY]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.CV_DATA]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'lastAnalyzedAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.JOB_DATA]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'lastAnalyzedAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.CV_JOB_MATCHES]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.GENERATED_CONTENT]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.CONTACT_MESSAGES]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.NEWSLETTER_SUBSCRIPTIONS]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.USER_NOTIFICATIONS]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'readAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.FEATURE_USAGE]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'lastUsedAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.ANALYTICS_DATA]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.BILLING_RECORDS]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'updatedAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.SUBSCRIPTION_DATA]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'updatedAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.SECURITY_LOGS]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.AUDIT_LOGS]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
    [DataType.FAILED_LOGIN_ATTEMPTS]: {
        createdAt: 'createdAt',
        lastAccessedAt: 'createdAt',
        deletedAt: 'deletedAt',
        isDeleted: 'isDeleted',
    },
} as const;

/**
 * SQL queries for data retention operations
 */
export const RETENTION_QUERIES = {
    /**
     * Get records eligible for deletion
     */
    getEligibleForDeletion: (dataType: DataType, tableName: string) => {
        const fields = RETENTION_FIELD_MAPPINGS[dataType];
        return `
      SELECT id, "${fields.createdAt}" as created_at, "${fields.lastAccessedAt}" as last_accessed_at
      FROM "${tableName}"
      WHERE "${fields.isDeleted}" = false
      AND (
        "${fields.lastAccessedAt}" IS NOT NULL 
        AND "${fields.lastAccessedAt}" < NOW() - INTERVAL '${getRetentionDays(dataType)} days'
        OR "${fields.lastAccessedAt}" IS NULL 
        AND "${fields.createdAt}" < NOW() - INTERVAL '${getRetentionDays(dataType)} days'
      )
    `;
    },

    /**
     * Get records that need deletion notifications
     */
    getNeedingNotification: (dataType: DataType, tableName: string) => {
        const fields = RETENTION_FIELD_MAPPINGS[dataType];
        const policy = getRetentionPolicy(dataType);
        if (!policy.notifyBeforeDeletion) return null;

        const notificationDays = policy.retentionDays - policy.notificationDays;
        return `
      SELECT id, "${fields.createdAt}" as created_at, "${fields.lastAccessedAt}" as last_accessed_at
      FROM "${tableName}"
      WHERE "${fields.isDeleted}" = false
      AND (
        "${fields.lastAccessedAt}" IS NOT NULL 
        AND "${fields.lastAccessedAt}" < NOW() - INTERVAL '${notificationDays} days'
        AND "${fields.lastAccessedAt}" >= NOW() - INTERVAL '${policy.retentionDays} days'
        OR "${fields.lastAccessedAt}" IS NULL 
        AND "${fields.createdAt}" < NOW() - INTERVAL '${notificationDays} days'
        AND "${fields.createdAt}" >= NOW() - INTERVAL '${policy.retentionDays} days'
      )
    `;
    },

    /**
     * Soft delete a record
     */
    softDelete: (tableName: string, id: string) => {
        return `
      UPDATE "${tableName}"
      SET 
        "isDeleted" = true,
        "deletedAt" = NOW(),
        "deletedBy" = 'data-retention-system'
      WHERE id = '${id}'
    `;
    },

    /**
     * Hard delete a record (for non-sensitive data)
     */
    hardDelete: (tableName: string, id: string) => {
        return `DELETE FROM "${tableName}" WHERE id = '${id}'`;
    },

    /**
     * Anonymize a record
     */
    anonymize: (dataType: DataType, tableName: string, id: string) => {
        const anonymizationQueries = getAnonymizationQueries(dataType, tableName, id);
        return anonymizationQueries;
    },
};

/**
 * Get retention days for a data type (helper function)
 */
function getRetentionDays(dataType: DataType): number {
    // import locally to avoid circular deps at module init time
    const { RETENTION_PERIODS } = require('./data-retention') as typeof import('./data-retention');
    return (RETENTION_PERIODS as any)[dataType] || 365;
}

/**
 * Get retention policy for a data type (helper function)
 */
function getRetentionPolicy(dataType: DataType) {
    // import locally to avoid circular deps at module init time
    const mod = require('./data-retention') as typeof import('./data-retention');
    return mod.getRetentionPolicy(dataType);
}

/**
 * Get anonymization queries for different data types
 */
function getAnonymizationQueries(dataType: DataType, tableName: string, id: string): string[] {
    const queries: string[] = [];

    switch (dataType) {
        case DataType.USER_PROFILE:
            queries.push(`
        UPDATE "${tableName}"
        SET 
          "fullName" = 'ANONYMIZED',
          "email" = CONCAT('anonymized_', id, '@deleted.local'),
          "username" = CONCAT('user_', SUBSTRING(id, 1, 8)),
          "avatarUrl" = NULL,
          "preferences" = '{}',
          "deletedAt" = NOW(),
          "deletedBy" = 'data-retention-system'
        WHERE id = '${id}'
      `);
            break;

        case DataType.CV_DATA:
            queries.push(`
        UPDATE "${tableName}"
        SET 
          "fileName" = 'anonymized_cv.pdf',
          "extractedText" = 'ANONYMIZED',
          "technicalSkills" = '[]',
          "workExperience" = '{}',
          "education" = '{}',
          "certifications" = '{}',
          "languages" = '[]',
          "firstName" = 'ANONYMIZED',
          "lastName" = 'ANONYMIZED',
          "fullName" = 'ANONYMIZED',
          "email" = CONCAT('anonymized_', id, '@deleted.local'),
          "phone" = NULL,
          "linkedinUrl" = NULL,
          "websiteUrl" = NULL,
          "githubUrl" = NULL,
          "deletedAt" = NOW(),
          "deletedBy" = 'data-retention-system'
        WHERE id = '${id}'
      `);
            break;

        case DataType.JOB_DATA:
            queries.push(`
        UPDATE "${tableName}"
        SET 
          "content" = 'ANONYMIZED',
          "title" = 'ANONYMIZED',
          "companyName" = 'ANONYMIZED',
          "companyDescription" = 'ANONYMIZED',
          "companyLogoUrl" = NULL,
          "recruiterInfo" = '{}',
          "deletedAt" = NOW(),
          "deletedBy" = 'data-retention-system'
        WHERE id = '${id}'
      `);
            break;

        case DataType.CONTACT_MESSAGES:
            queries.push(`
        UPDATE "${tableName}"
        SET 
          "name" = 'ANONYMIZED',
          "email" = 'anonymized@deleted.local',
          "message" = 'ANONYMIZED',
          "deletedAt" = NOW(),
          "deletedBy" = 'data-retention-system'
        WHERE id = '${id}'
      `);
            break;

        case DataType.NEWSLETTER_SUBSCRIPTIONS:
            queries.push(`
        UPDATE "${tableName}"
        SET 
          "email" = CONCAT('anonymized_', id, '@deleted.local'),
          "deletedAt" = NOW(),
          "deletedBy" = 'data-retention-system'
        WHERE id = '${id}'
      `);
            break;

        case DataType.GENERATED_CONTENT:
            queries.push(`
        UPDATE "${tableName}"
        SET 
          "content" = 'ANONYMIZED',
          "metadata" = '{}',
          "deletedAt" = NOW(),
          "deletedBy" = 'data-retention-system'
        WHERE id = '${id}'
      `);
            break;

        default:
            // For other data types, just soft delete
            queries.push(RETENTION_QUERIES.softDelete(tableName, id));
    }

    return queries;
}

/**
 * Get table name for a data type
 */
export function getTableName(dataType: DataType): string {
    return DATA_RETENTION_TABLES[dataType];
}

/**
 * Get field mappings for a data type
 */
export function getFieldMappings(dataType: DataType) {
    return RETENTION_FIELD_MAPPINGS[dataType];
}
