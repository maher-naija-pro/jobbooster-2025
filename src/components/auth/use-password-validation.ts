'use client'

import { useState, useCallback, useRef } from 'react'
import {
    PasswordValidator,
    PasswordConstraints,
    PasswordValidationResult,
    DEFAULT_PASSWORD_CONSTRAINTS
} from './password-constraints'
import { logger } from '@/lib/logger'

interface UsePasswordValidationOptions {
    constraints?: PasswordConstraints
    validateOnChange?: boolean
    validateOnBlur?: boolean
}

interface UsePasswordValidationReturn {
    password: string
    confirmPassword: string
    validationResult: PasswordValidationResult | null
    confirmationResult: PasswordValidationResult | null
    setPassword: (password: string) => void
    setConfirmPassword: (confirmPassword: string) => void
    validatePassword: (password: string) => PasswordValidationResult
    validateConfirmation: (password: string, confirmPassword: string) => PasswordValidationResult
    isValid: boolean
    errors: string[]
    clearValidation: () => void
    reset: () => void
}

export const usePasswordValidation = (options: UsePasswordValidationOptions = {}): UsePasswordValidationReturn => {
    const {
        constraints = DEFAULT_PASSWORD_CONSTRAINTS,
        validateOnChange = true,
        validateOnBlur = true
    } = options

    const [password, setPasswordState] = useState('')
    const [confirmPassword, setConfirmPasswordState] = useState('')
    const [validationResult, setValidationResult] = useState<PasswordValidationResult | null>(null)
    const [confirmationResult, setConfirmationResult] = useState<PasswordValidationResult | null>(null)

    const validator = useRef(new PasswordValidator(constraints))

    const validatePassword = useCallback((passwordToValidate: string): PasswordValidationResult => {
        const result = validator.current.validate(passwordToValidate)
        logger.debug('Password validation in hook', {
            isValid: result.isValid,
            errors: result.errors,
            strength: result.strength
        })
        return result
    }, [])

    const validateConfirmation = useCallback((passwordToValidate: string, confirmPasswordToValidate: string): PasswordValidationResult => {
        const result = validator.current.validateConfirmation(passwordToValidate, confirmPasswordToValidate)
        logger.debug('Password confirmation validation in hook', {
            isValid: result.isValid,
            errors: result.errors
        })
        return result
    }, [])

    const setPassword = useCallback((newPassword: string) => {
        setPasswordState(newPassword)

        if (validateOnChange && newPassword.length > 0) {
            const result = validatePassword(newPassword)
            setValidationResult(result)

            // Also validate confirmation if confirmPassword has a value
            if (confirmPassword.length > 0) {
                const confResult = validateConfirmation(newPassword, confirmPassword)
                setConfirmationResult(confResult)
            }
        } else if (newPassword.length === 0) {
            setValidationResult(null)
            setConfirmationResult(null)
        }
    }, [validateOnChange, validatePassword, confirmPassword, validateConfirmation])

    const setConfirmPassword = useCallback((newConfirmPassword: string) => {
        setConfirmPasswordState(newConfirmPassword)

        if (validateOnChange && password.length > 0 && newConfirmPassword.length > 0) {
            const result = validateConfirmation(password, newConfirmPassword)
            setConfirmationResult(result)
        } else if (newConfirmPassword.length === 0) {
            setConfirmationResult(null)
        }
    }, [validateOnChange, password, validateConfirmation])

    const isValid = Boolean(
        validationResult?.isValid &&
        (confirmPassword.length === 0 || confirmationResult?.isValid)
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
        setPasswordState('')
        setConfirmPasswordState('')
        setValidationResult(null)
        setConfirmationResult(null)
    }, [])

    return {
        password,
        confirmPassword,
        validationResult,
        confirmationResult,
        setPassword,
        setConfirmPassword,
        validatePassword,
        validateConfirmation,
        isValid,
        errors,
        clearValidation,
        reset
    }
}

export default usePasswordValidation
