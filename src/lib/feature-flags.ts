/**
 * Feature Flags Configuration
 * 
 * This module provides a centralized way to manage feature flags
 * using environment variables. All feature flags should be defined here
 * with proper TypeScript types and default values.
 */

export interface FeatureFlags {
    /** Enable/disable pricing functionality across the application */
    ENABLE_PRICING: boolean;
    /** Enable/disable anonymous access to the application */
    ENABLE_ANONYMOUS_ACCESS: boolean;
    /** Enable/disable email verification requirement */
    REQUIRE_EMAIL_VERIFICATION: boolean;
    /** Enable/disable strict email validation */
    EMAIL_VALIDATION_STRICT: boolean;
    /** Enable/disable disposable email addresses */
    ALLOW_DISPOSABLE_EMAILS: boolean;
    /** Enable/disable social media icons in footer */
    ENABLE_SOCIAL_ICONS: boolean;
    /** Enable/disable notification settings functionality */
    ENABLE_NOTIFICATIONS: boolean;
    /** Enable/disable cover letter generation feature */
    ENABLE_COVER_LETTER_GENERATION: boolean;
    /** Enable/disable email generation feature */
    ENABLE_EMAIL_GENERATION: boolean;
    /** Enable/disable CV analysis feature */
    ENABLE_CV_ANALYSIS: boolean;
}

/**
 * Default feature flag values
 * These are used when environment variables are not set
 */
const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
    ENABLE_PRICING: true,
    ENABLE_ANONYMOUS_ACCESS: true,
    REQUIRE_EMAIL_VERIFICATION: true,
    EMAIL_VALIDATION_STRICT: true,
    ALLOW_DISPOSABLE_EMAILS: false,
    ENABLE_SOCIAL_ICONS: false,
    ENABLE_NOTIFICATIONS: false,
    ENABLE_COVER_LETTER_GENERATION: true,
    ENABLE_EMAIL_GENERATION: true,
    ENABLE_CV_ANALYSIS: true,
};

/**
 * Parse boolean environment variable with fallback to default
 */
function parseBooleanEnvVar(
    value: string | undefined,
    defaultValue: boolean
): boolean {
    if (value === undefined) return defaultValue;
    return value.toLowerCase() === 'true';
}

/**
 * Get all feature flags with proper type safety
 * This function should be used throughout the application to access feature flags
 */
export function getFeatureFlags(): FeatureFlags {
    return {
        ENABLE_PRICING: parseBooleanEnvVar(
            process.env.NEXT_PUBLIC_ENABLE_PRICING,
            DEFAULT_FEATURE_FLAGS.ENABLE_PRICING
        ),
        ENABLE_ANONYMOUS_ACCESS: parseBooleanEnvVar(
            process.env.ENABLE_ANONYMOUS_ACCESS,
            DEFAULT_FEATURE_FLAGS.ENABLE_ANONYMOUS_ACCESS
        ),
        REQUIRE_EMAIL_VERIFICATION: parseBooleanEnvVar(
            process.env.REQUIRE_EMAIL_VERIFICATION,
            DEFAULT_FEATURE_FLAGS.REQUIRE_EMAIL_VERIFICATION
        ),
        EMAIL_VALIDATION_STRICT: parseBooleanEnvVar(
            process.env.EMAIL_VALIDATION_STRICT,
            DEFAULT_FEATURE_FLAGS.EMAIL_VALIDATION_STRICT
        ),
        ALLOW_DISPOSABLE_EMAILS: parseBooleanEnvVar(
            process.env.ALLOW_DISPOSABLE_EMAILS,
            DEFAULT_FEATURE_FLAGS.ALLOW_DISPOSABLE_EMAILS
        ),
        ENABLE_SOCIAL_ICONS: parseBooleanEnvVar(
            process.env.NEXT_PUBLIC_ENABLE_SOCIAL_ICONS,
            DEFAULT_FEATURE_FLAGS.ENABLE_SOCIAL_ICONS
        ),
        ENABLE_NOTIFICATIONS: parseBooleanEnvVar(
            process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS,
            DEFAULT_FEATURE_FLAGS.ENABLE_NOTIFICATIONS
        ),
        ENABLE_COVER_LETTER_GENERATION: parseBooleanEnvVar(
            process.env.NEXT_PUBLIC_ENABLE_COVER_LETTER_GENERATION,
            DEFAULT_FEATURE_FLAGS.ENABLE_COVER_LETTER_GENERATION
        ),
        ENABLE_EMAIL_GENERATION: parseBooleanEnvVar(
            process.env.NEXT_PUBLIC_ENABLE_EMAIL_GENERATION,
            DEFAULT_FEATURE_FLAGS.ENABLE_EMAIL_GENERATION
        ),
        ENABLE_CV_ANALYSIS: parseBooleanEnvVar(
            process.env.NEXT_PUBLIC_ENABLE_CV_ANALYSIS,
            DEFAULT_FEATURE_FLAGS.ENABLE_CV_ANALYSIS
        ),
    };
}

/**
 * Get a specific feature flag by key
 * Useful for individual flag checks
 */
export function getFeatureFlag<K extends keyof FeatureFlags>(
    key: K
): FeatureFlags[K] {
    const flags = getFeatureFlags();
    return flags[key];
}

/**
 * Check if pricing is enabled
 * Convenience function for the most commonly used feature flag
 */
export function isPricingEnabled(): boolean {
    return getFeatureFlag('ENABLE_PRICING');
}

/**
 * Check if anonymous access is enabled
 * Convenience function for authentication feature flag
 */
export function isAnonymousAccessEnabled(): boolean {
    return getFeatureFlag('ENABLE_ANONYMOUS_ACCESS');
}

/**
 * Check if notifications are enabled
 * Convenience function for notification feature flag
 */
export function isNotificationsEnabled(): boolean {
    return getFeatureFlag('ENABLE_NOTIFICATIONS');
}

/**
 * Check if email verification is required
 * Convenience function for email verification feature flag
 */
export function isEmailVerificationRequired(): boolean {
    return getFeatureFlag('REQUIRE_EMAIL_VERIFICATION');
}

/**
 * Check if cover letter generation is enabled
 * Convenience function for cover letter generation feature flag
 */
export function isCoverLetterGenerationEnabled(): boolean {
    return getFeatureFlag('ENABLE_COVER_LETTER_GENERATION');
}

/**
 * Check if email generation is enabled
 * Convenience function for email generation feature flag
 */
export function isEmailGenerationEnabled(): boolean {
    return getFeatureFlag('ENABLE_EMAIL_GENERATION');
}

/**
 * Check if CV analysis is enabled
 * Convenience function for CV analysis feature flag
 */
export function isCVAnalysisEnabled(): boolean {
    return getFeatureFlag('ENABLE_CV_ANALYSIS');
}
