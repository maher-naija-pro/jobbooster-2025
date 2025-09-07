'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Mail, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    EmailValidator,
    EmailConstraints,
    EmailValidationResult,
    DEFAULT_EMAIL_CONSTRAINTS
} from './email-constraints'
import { logger } from '@/lib/logger'

interface EmailInputProps {
    name: string
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    placeholder?: string
    className?: string
    constraints?: EmailConstraints
    disabled?: boolean
    required?: boolean
    autoComplete?: string
    id?: string
    type?: 'email' | 'text'
}

export const EmailInput: React.FC<EmailInputProps> = ({
    name,
    value,
    onChange,
    onBlur,
    placeholder = 'Enter your email',
    className,
    constraints = DEFAULT_EMAIL_CONSTRAINTS,
    disabled = false,
    required = false,
    autoComplete = 'email',
    id,
    type = 'email'
}) => {
    const [validationResult, setValidationResult] = useState<EmailValidationResult | null>(null)
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const validator = useRef(new EmailValidator(constraints))

    // Update validator when constraints change
    useEffect(() => {
        validator.current.updateConstraints(constraints)
    }, [constraints])

    const validateEmail = useCallback((email: string) => {
        const result = validator.current.validate(email)
        setValidationResult(result)
        logger.debug('Email validation in component', {
            isValid: result.isValid,
            errors: result.errors,
            strength: result.strength
        })
        return result
    }, [])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value
        onChange(newValue)

        if (newValue.length > 0) {
            validateEmail(newValue)
        } else {
            setValidationResult(null)
        }
    }, [onChange, validateEmail])

    const handleFocus = useCallback(() => {
        setIsFocused(true)
    }, [])

    const handleBlur = useCallback(() => {
        setIsFocused(false)
        if (onBlur) {
            onBlur()
        }
    }, [onBlur])

    const requirements = validator.current.getRequirementsDescription()
    const hasErrors = validationResult && !validationResult.isValid
    const hasValue = value.length > 0

    return (
        <div className="space-y-2">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    className={cn(
                        'w-full pl-10 pr-3 py-2 border rounded-md shadow-sm transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                        hasErrors && hasValue && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                        !hasErrors && hasValue && 'border-green-300 focus:border-green-500 focus:ring-green-500',
                        !hasValue && !isFocused && 'border-gray-300',
                        className
                    )}
                />
            </div>

            {/* Error messages */}
            {hasErrors && hasValue && (
                <div className="space-y-1">
                    {validationResult?.errors.map((error, index) => (
                        <div key={index} className="flex items-center text-sm text-red-600">
                            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Success message */}
            {validationResult?.isValid && hasValue && (
                <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>Email address is valid</span>
                </div>
            )}

            {/* Requirements display (optional - can be shown on focus or always) */}
            {isFocused && requirements.length > 0 && (
                <div className="text-xs text-gray-500 space-y-1">
                    <div className="font-medium">Email requirements:</div>
                    <ul className="list-disc list-inside space-y-0.5">
                        {requirements.map((requirement, index) => (
                            <li key={index}>{requirement}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

export default EmailInput
