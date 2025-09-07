// Centralized password constraint configuration and validation
import { logger } from '@/lib/logger'

export interface PasswordConstraints {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxLength?: number
    customPattern?: RegExp
    customMessage?: string
}

export interface PasswordValidationResult {
    isValid: boolean
    errors: string[]
    strength: 'weak' | 'medium' | 'strong'
    score: number
}

// Default password constraints - 6 character minimum to match Supabase requirements
export const DEFAULT_PASSWORD_CONSTRAINTS: PasswordConstraints = {
    minLength: 6,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
    maxLength: 128
}

// Strong password constraints for sensitive operations
export const STRONG_PASSWORD_CONSTRAINTS: PasswordConstraints = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLength: 128
}

export class PasswordValidator {
    private constraints: PasswordConstraints

    constructor(constraints: PasswordConstraints = DEFAULT_PASSWORD_CONSTRAINTS) {
        this.constraints = constraints
        logger.debug('PasswordValidator initialized', { constraints })
    }

    /**
     * Validates a password against the configured constraints
     */
    validate(password: string): PasswordValidationResult {
        const errors: string[] = []
        let score = 0

        logger.debug('Validating password', {
            passwordLength: password.length,
            constraints: this.constraints
        })

        // Check minimum length
        if (password.length < this.constraints.minLength) {
            errors.push(`Password must be at least ${this.constraints.minLength} characters long`)
        } else {
            score += 1
        }

        // Check maximum length
        if (this.constraints.maxLength && password.length > this.constraints.maxLength) {
            errors.push(`Password must be no more than ${this.constraints.maxLength} characters long`)
        } else if (this.constraints.maxLength) {
            score += 1
        }

        // Check uppercase requirement
        if (this.constraints.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter')
        } else if (this.constraints.requireUppercase) {
            score += 1
        }

        // Check lowercase requirement
        if (this.constraints.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter')
        } else if (this.constraints.requireLowercase) {
            score += 1
        }

        // Check numbers requirement
        if (this.constraints.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number')
        } else if (this.constraints.requireNumbers) {
            score += 1
        }

        // Check special characters requirement
        if (this.constraints.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character')
        } else if (this.constraints.requireSpecialChars) {
            score += 1
        }

        // Check custom pattern
        if (this.constraints.customPattern && !this.constraints.customPattern.test(password)) {
            errors.push(this.constraints.customMessage || 'Password does not meet custom requirements')
        } else if (this.constraints.customPattern) {
            score += 1
        }

        // Calculate strength based on score and length
        const totalChecks = this.getTotalChecks()
        const strengthScore = (score / totalChecks) * 100

        let strength: 'weak' | 'medium' | 'strong' = 'weak'
        if (strengthScore >= 80) {
            strength = 'strong'
        } else if (strengthScore >= 60) {
            strength = 'medium'
        }

        const result: PasswordValidationResult = {
            isValid: errors.length === 0,
            errors,
            strength,
            score: Math.round(strengthScore)
        }

        logger.debug('Password validation result', {
            isValid: result.isValid,
            errorCount: errors.length,
            strength: result.strength,
            score: result.score
        })

        return result
    }

    /**
     * Validates password confirmation
     */
    validateConfirmation(password: string, confirmPassword: string): PasswordValidationResult {
        const baseResult = this.validate(password)

        if (password !== confirmPassword) {
            return {
                ...baseResult,
                isValid: false,
                errors: [...baseResult.errors, 'Passwords do not match']
            }
        }

        return baseResult
    }

    /**
     * Gets the total number of validation checks
     */
    private getTotalChecks(): number {
        let checks = 1 // minLength is always checked

        if (this.constraints.maxLength) checks += 1
        if (this.constraints.requireUppercase) checks += 1
        if (this.constraints.requireLowercase) checks += 1
        if (this.constraints.requireNumbers) checks += 1
        if (this.constraints.requireSpecialChars) checks += 1
        if (this.constraints.customPattern) checks += 1

        return checks
    }

    /**
     * Updates the password constraints
     */
    updateConstraints(newConstraints: Partial<PasswordConstraints>): void {
        this.constraints = { ...this.constraints, ...newConstraints }
        logger.debug('Password constraints updated', { constraints: this.constraints })
    }

    /**
     * Gets the current constraints
     */
    getConstraints(): PasswordConstraints {
        return { ...this.constraints }
    }

    /**
     * Gets a human-readable description of the password requirements
     */
    getRequirementsDescription(): string[] {
        const requirements: string[] = []

        requirements.push(`At least ${this.constraints.minLength} characters`)

        if (this.constraints.maxLength) {
            requirements.push(`No more than ${this.constraints.maxLength} characters`)
        }

        if (this.constraints.requireUppercase) {
            requirements.push('At least one uppercase letter')
        }

        if (this.constraints.requireLowercase) {
            requirements.push('At least one lowercase letter')
        }

        if (this.constraints.requireNumbers) {
            requirements.push('At least one number')
        }

        if (this.constraints.requireSpecialChars) {
            requirements.push('At least one special character')
        }

        if (this.constraints.customMessage) {
            requirements.push(this.constraints.customMessage)
        }

        return requirements
    }
}

// Create default validator instance
export const passwordValidator = new PasswordValidator(DEFAULT_PASSWORD_CONSTRAINTS)

// Create strong validator instance for sensitive operations
export const strongPasswordValidator = new PasswordValidator(STRONG_PASSWORD_CONSTRAINTS)

// Convenience functions
export const validatePassword = (password: string, constraints?: PasswordConstraints): PasswordValidationResult => {
    if (constraints) {
        const validator = new PasswordValidator(constraints)
        return validator.validate(password)
    }
    return passwordValidator.validate(password)
}

export const validatePasswordConfirmation = (
    password: string,
    confirmPassword: string,
    constraints?: PasswordConstraints
): PasswordValidationResult => {
    if (constraints) {
        const validator = new PasswordValidator(constraints)
        return validator.validateConfirmation(password, confirmPassword)
    }
    return passwordValidator.validateConfirmation(password, confirmPassword)
}

export const getPasswordRequirements = (constraints?: PasswordConstraints): string[] => {
    if (constraints) {
        const validator = new PasswordValidator(constraints)
        return validator.getRequirementsDescription()
    }
    return passwordValidator.getRequirementsDescription()
}
