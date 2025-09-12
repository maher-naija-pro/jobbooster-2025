/**
 * Data Retention System
 * 
 * This module provides a comprehensive data retention system for GDPR compliance.
 * It includes configuration, utilities, and database operations for managing
 * data retention policies across the JobBooster application.
 */

// Core data retention types and policies
export {
    DataType,
    RETENTION_PERIODS,
    RETENTION_POLICIES,
    getRetentionPolicy,
    getDataTypesRequiringNotification,
    getDataTypesRequiringManualReview,
    calculateDeletionDate,
    calculateNotificationDate,
    isEligibleForDeletion,
    shouldSendDeletionNotification,
    getRetentionPoliciesSummary,
} from '../data-retention';

// Database schema and operations
export {
    DATA_RETENTION_TABLES,
    RETENTION_FIELD_MAPPINGS,
    RETENTION_QUERIES,
    getTableName,
    getFieldMappings,
} from './data-retention-schema';

// Utility functions
export {
    validateRetentionConfiguration,
    calculateRetentionStats,
    getEligibleRecords,
    getRecordsNeedingNotification,
    logRetentionOperation,
    createRetentionResult,
    formatRetentionPeriod,
    getDataRetentionSummary,
    validateRecordForRetention,
    type RetentionOperationResult,
    type RetentionOperationContext,
    type RetentionEligibleRecord,
} from './data-retention-utils';

// Configuration
export {
    DATA_RETENTION_CONFIG,
    getDataTypeConfig,
    isDataRetentionEnabled,
    isDryRunMode,
    getBatchSize,
    getMaxRecordsPerOperation,
} from '../../config/data-retention.config';
