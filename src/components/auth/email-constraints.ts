// Centralized email constraint configuration and validation
import { logger } from '@/lib/logger'

export interface EmailConstraints {
    required: boolean
    maxLength?: number
    customPattern?: RegExp
    customMessage?: string
    allowMultipleEmails?: boolean
    domainWhitelist?: string[]
    domainBlacklist?: string[]
}

export interface EmailValidationResult {
    isValid: boolean
    errors: string[]
    strength: 'weak' | 'medium' | 'strong'
    score: number
}

// Default email constraints
export const DEFAULT_EMAIL_CONSTRAINTS: EmailConstraints = {
    required: true,
    maxLength: 254, // RFC 5321 limit
    allowMultipleEmails: false
}

// Strict email constraints for sensitive operations
export const STRICT_EMAIL_CONSTRAINTS: EmailConstraints = {
    required: true,
    maxLength: 254,
    allowMultipleEmails: false,
    domainWhitelist: ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com']
}

// Basic email regex pattern (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

// Multiple emails regex (comma or semicolon separated)
const MULTIPLE_EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(?:[,;]\s*[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)*$/

export class EmailValidator {
    private constraints: EmailConstraints

    constructor(constraints: EmailConstraints = DEFAULT_EMAIL_CONSTRAINTS) {
        this.constraints = constraints
        logger.debug('EmailValidator initialized', { constraints })
    }

    /**
     * Validates an email against the configured constraints
     */
    validate(email: string): EmailValidationResult {
        const errors: string[] = []
        let score = 0

        logger.debug('Validating email', {
            emailLength: email.length,
            constraints: this.constraints
        })

        // Check if email is required and empty
        if (this.constraints.required && email.trim().length === 0) {
            errors.push('Email is required')
            return {
                isValid: false,
                errors,
                strength: 'weak',
                score: 0
            }
        }

        // If email is empty and not required, it's valid
        if (email.trim().length === 0) {
            return {
                isValid: true,
                errors: [],
                strength: 'weak',
                score: 0
            }
        }

        // Check maximum length
        if (this.constraints.maxLength && email.length > this.constraints.maxLength) {
            errors.push(`Email must be no more than ${this.constraints.maxLength} characters long`)
        } else if (this.constraints.maxLength) {
            score += 1
        }

        // Validate email format
        const emailPattern = this.constraints.allowMultipleEmails ? MULTIPLE_EMAIL_REGEX : EMAIL_REGEX
        if (!emailPattern.test(email.trim())) {
            if (this.constraints.allowMultipleEmails) {
                errors.push('Please enter valid email addresses separated by commas or semicolons')
            } else {
                errors.push('Please enter a valid email address')
            }
        } else {
            score += 2 // Email format is worth more points
        }

        // Check custom pattern
        if (this.constraints.customPattern && !this.constraints.customPattern.test(email)) {
            errors.push(this.constraints.customMessage || 'Email does not meet custom requirements')
        } else if (this.constraints.customPattern) {
            score += 1
        }

        // Check domain whitelist
        if (this.constraints.domainWhitelist && this.constraints.domainWhitelist.length > 0) {
            const domains = this.extractDomains(email)
            const hasValidDomain = domains.some(domain =>
                this.constraints.domainWhitelist!.includes(domain.toLowerCase())
            )

            if (!hasValidDomain) {
                errors.push(`Email must be from one of these domains: ${this.constraints.domainWhitelist.join(', ')}`)
            } else {
                score += 1
            }
        }

        // Check domain blacklist
        if (this.constraints.domainBlacklist && this.constraints.domainBlacklist.length > 0) {
            const domains = this.extractDomains(email)
            const hasBlockedDomain = domains.some(domain =>
                this.constraints.domainBlacklist!.includes(domain.toLowerCase())
            )

            if (hasBlockedDomain) {
                errors.push('This email domain is not allowed')
            } else {
                score += 1
            }
        }

        // Calculate strength based on score and additional factors
        const totalChecks = this.getTotalChecks()
        const strengthScore = (score / totalChecks) * 100

        // Additional strength factors
        let additionalScore = 0
        if (email.includes('@')) {
            const [local, domain] = email.split('@')
            if (local.length >= 3) additionalScore += 10
            if (domain.includes('.')) additionalScore += 10
            if (domain.length >= 5) additionalScore += 10
        }

        const finalScore = Math.min(100, strengthScore + additionalScore)

        let strength: 'weak' | 'medium' | 'strong' = 'weak'
        if (finalScore >= 80) {
            strength = 'strong'
        } else if (finalScore >= 60) {
            strength = 'medium'
        }

        const result: EmailValidationResult = {
            isValid: errors.length === 0,
            errors,
            strength,
            score: Math.round(finalScore)
        }

        logger.debug('Email validation result', {
            isValid: result.isValid,
            errorCount: errors.length,
            strength: result.strength,
            score: result.score
        })

        return result
    }

    /**
     * Validates email confirmation
     */
    validateConfirmation(email: string, confirmEmail: string): EmailValidationResult {
        const baseResult = this.validate(email)

        if (email !== confirmEmail) {
            return {
                ...baseResult,
                isValid: false,
                errors: [...baseResult.errors, 'Email addresses do not match']
            }
        }

        return baseResult
    }

    /**
     * Extracts domains from email(s)
     */
    private extractDomains(email: string): string[] {
        const emails = this.constraints.allowMultipleEmails
            ? email.split(/[,;]/).map(e => e.trim())
            : [email.trim()]

        return emails
            .filter(e => e.includes('@'))
            .map(e => e.split('@')[1])
            .filter(domain => domain && domain.length > 0)
    }

    /**
     * Gets the total number of validation checks
     */
    private getTotalChecks(): number {
        let checks = 1 // Email format is always checked

        if (this.constraints.maxLength) checks += 1
        if (this.constraints.customPattern) checks += 1
        if (this.constraints.domainWhitelist && this.constraints.domainWhitelist.length > 0) checks += 1
        if (this.constraints.domainBlacklist && this.constraints.domainBlacklist.length > 0) checks += 1

        return checks
    }

    /**
     * Updates the email constraints
     */
    updateConstraints(newConstraints: Partial<EmailConstraints>): void {
        this.constraints = { ...this.constraints, ...newConstraints }
        logger.debug('Email constraints updated', { constraints: this.constraints })
    }

    /**
     * Gets the current constraints
     */
    getConstraints(): EmailConstraints {
        return { ...this.constraints }
    }

    /**
     * Gets a human-readable description of the email requirements
     */
    getRequirementsDescription(): string[] {
        const requirements: string[] = []

        if (this.constraints.required) {
            requirements.push('Email is required')
        }

        if (this.constraints.maxLength) {
            requirements.push(`No more than ${this.constraints.maxLength} characters`)
        }

        if (this.constraints.allowMultipleEmails) {
            requirements.push('Multiple emails allowed (separated by commas or semicolons)')
        }

        if (this.constraints.domainWhitelist && this.constraints.domainWhitelist.length > 0) {
            requirements.push(`Must be from: ${this.constraints.domainWhitelist.join(', ')}`)
        }

        if (this.constraints.domainBlacklist && this.constraints.domainBlacklist.length > 0) {
            requirements.push(`Cannot be from: ${this.constraints.domainBlacklist.join(', ')}`)
        }

        if (this.constraints.customMessage) {
            requirements.push(this.constraints.customMessage)
        }

        return requirements
    }
}

// Create default validator instance
export const emailValidator = new EmailValidator(DEFAULT_EMAIL_CONSTRAINTS)

// Create strict validator instance for sensitive operations
export const strictEmailValidator = new EmailValidator(STRICT_EMAIL_CONSTRAINTS)

// Convenience functions
export const validateEmail = (email: string, constraints?: EmailConstraints): EmailValidationResult => {
    if (constraints) {
        const validator = new EmailValidator(constraints)
        return validator.validate(email)
    }
    return emailValidator.validate(email)
}

export const validateEmailConfirmation = (
    email: string,
    confirmEmail: string,
    constraints?: EmailConstraints
): EmailValidationResult => {
    if (constraints) {
        const validator = new EmailValidator(constraints)
        return validator.validateConfirmation(email, confirmEmail)
    }
    return emailValidator.validateConfirmation(email, confirmEmail)
}

export const getEmailRequirements = (constraints?: EmailConstraints): string[] => {
    if (constraints) {
        const validator = new EmailValidator(constraints)
        return validator.getRequirementsDescription()
    }
    return emailValidator.getRequirementsDescription()
}
