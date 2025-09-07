'use client'

import { useState, useCallback, useRef } from 'react'
import {
    EmailValidator,
    EmailConstraints,
    EmailValidationResult,
    DEFAULT_EMAIL_CONSTRAINTS
} from './email-constraints'
import { logger } from '@/lib/logger'

interface UseEmailValidationOptions {
    constraints?: EmailConstraints
    validateOnChange?: boolean
    validateOnBlur?: boolean
}

interface UseEmailValidationReturn {
    email: string
    confirmEmail: string
    validationResult: EmailValidationResult | null
    confirmationResult: EmailValidationResult | null
    setEmail: (email: string) => void
    setConfirmEmail: (confirmEmail: string) => void
    validateEmail: (email: string) => EmailValidationResult
    validateConfirmation: (email: string, confirmEmail: string) => EmailValidationResult
    isValid: boolean
    errors: string[]
    clearValidation: () => void
    reset: () => void
}

export const useEmailValidation = (options: UseEmailValidationOptions = {}): UseEmailValidationReturn => {
    const {
        constraints = DEFAULT_EMAIL_CONSTRAINTS,
        validateOnChange = true,
        validateOnBlur = true
    } = options

    const [email, setEmailState] = useState('')
    const [confirmEmail, setConfirmEmailState] = useState('')
    const [validationResult, setValidationResult] = useState<EmailValidationResult | null>(null)
    const [confirmationResult, setConfirmationResult] = useState<EmailValidationResult | null>(null)

    const validator = useRef(new EmailValidator(constraints))

    const validateEmail = useCallback((emailToValidate: string): EmailValidationResult => {
        const result = validator.current.validate(emailToValidate)
        logger.debug('Email validation in hook', {
            isValid: result.isValid,
            errors: result.errors,
            strength: result.strength
        })
        return result
    }, [])

    const validateConfirmation = useCallback((emailToValidate: string, confirmEmailToValidate: string): EmailValidationResult => {
        const result = validator.current.validateConfirmation(emailToValidate, confirmEmailToValidate)
        logger.debug('Email confirmation validation in hook', {
            isValid: result.isValid,
            errors: result.errors
        })
        return result
    }, [])

    const setEmail = useCallback((newEmail: string) => {
        setEmailState(newEmail)

        if (validateOnChange && newEmail.length > 0) {
            const result = validateEmail(newEmail)
            setValidationResult(result)

            // Also validate confirmation if confirmEmail has a value
            if (confirmEmail.length > 0) {
                const confResult = validateConfirmation(newEmail, confirmEmail)
                setConfirmationResult(confResult)
            }
        } else if (newEmail.length === 0) {
            setValidationResult(null)
            setConfirmationResult(null)
        }
    }, [validateOnChange, validateEmail, confirmEmail, validateConfirmation])

    const setConfirmEmail = useCallback((newConfirmEmail: string) => {
        setConfirmEmailState(newConfirmEmail)

        if (validateOnChange && email.length > 0 && newConfirmEmail.length > 0) {
            const result = validateConfirmation(email, newConfirmEmail)
            setConfirmationResult(result)
        } else if (newConfirmEmail.length === 0) {
            setConfirmationResult(null)
        }
    }, [validateOnChange, email, validateConfirmation])

    const isValid = Boolean(
        validationResult?.isValid &&
        (confirmEmail.length === 0 || confirmationResult?.isValid)
    )

    const errors = [
        ...(validationResult?.errors || []),
        ...(confirmationResult?.errors || [])
    ]

    const clearValidation = useCallback(() => {
        setValidationResult(null)
        setConfirmationResult(null)
    }, [])

    const reset = useCallback(() => {
        setEmailState('')
        setConfirmEmailState('')
        setValidationResult(null)
        setConfirmationResult(null)
    }, [])

    return {
        email,
        confirmEmail,
        validationResult,
        confirmationResult,
        setEmail,
        setConfirmEmail,
        validateEmail,
        validateConfirmation,
        isValid,
        errors,
        clearValidation,
        reset
    }
}

export default useEmailValidation
