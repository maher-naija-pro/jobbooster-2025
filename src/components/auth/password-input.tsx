'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
    PasswordValidator,
    PasswordConstraints,
    PasswordValidationResult,
    DEFAULT_PASSWORD_CONSTRAINTS
} from './password-constraints'
import { logger } from '@/lib/logger'

interface PasswordInputProps {
    name: string
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    placeholder?: string
    className?: string
    constraints?: PasswordConstraints
    disabled?: boolean
    required?: boolean
    autoComplete?: string
    id?: string
}



export const PasswordInput: React.FC<PasswordInputProps> = ({
    name,
    value,
    onChange,
    onBlur,
    placeholder = 'Enter your password',
    className,
    constraints = DEFAULT_PASSWORD_CONSTRAINTS,
    disabled = false,
    required = false,
    autoComplete = 'current-password',
    id
}) => {
    const [showPassword, setShowPassword] = useState(false)
    const [validationResult, setValidationResult] = useState<PasswordValidationResult | null>(null)
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const validator = useRef(new PasswordValidator(constraints))

    // Update validator when constraints change
    useEffect(() => {
        validator.current.updateConstraints(constraints)
    }, [constraints])

    const validatePassword = useCallback((password: string) => {
        const result = validator.current.validate(password)
        setValidationResult(result)
        logger.debug('Password validation in component', {
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
            validatePassword(newValue)
        } else {
            setValidationResult(null)
        }
    }, [onChange, validatePassword])

    const handleFocus = useCallback(() => {
        setIsFocused(true)
    }, [])

    const handleBlur = useCallback(() => {
        setIsFocused(false)
        if (onBlur) {
            onBlur()
        }
    }, [onBlur])

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword(prev => !prev)
        // Focus back to input after toggling
        setTimeout(() => {
            inputRef.current?.focus()
        }, 0)
    }, [])

    const requirements = validator.current.getRequirementsDescription()
    const hasErrors = validationResult && !validationResult.isValid
    const hasValue = value.length > 0

    return (
        <div className="space-y-2">
            <div className="relative">
                <input
                    ref={inputRef}
                    id={id}
                    name={name}
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    className={cn(
                        'w-full px-3 py-2 pr-20 border rounded-md shadow-sm transition-colors',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
                        hasErrors && hasValue && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                        !hasErrors && hasValue && 'border-green-300 focus:border-green-500 focus:ring-green-500',
                        !hasValue && !isFocused && 'border-gray-300',
                        className
                    )}
                />

                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    disabled={disabled}
                    className={cn(
                        'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md',
                        'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'transition-colors'
                    )}
                    tabIndex={-1}
                >
                    {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-500" />
                    ) : (
                        <Eye className="w-4 h-4 text-gray-500" />
                    )}
                </button>
            </div>

            {/* Error messages are handled by the parent form component */}

            {/* Success message */}
            {validationResult?.isValid && hasValue && (
                <div className="flex items-center text-sm text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span>Password meets all requirements</span>
                </div>
            )}


        </div>
    )
}

export default PasswordInput
