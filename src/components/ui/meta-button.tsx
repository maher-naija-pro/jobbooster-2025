"use client"

import React, { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MetaButtonProps {
    isLoading?: boolean
    disabled?: boolean
    children?: React.ReactNode
    className?: string
    onClick?: () => void
    type?: "button" | "submit" | "reset"
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "default" |
    "primary-outline" | "secondary-outline" | "success-outline" | "warning-outline" | "danger-outline" |
    "primary-ghost" | "secondary-ghost" | "success-ghost" | "warning-ghost" | "danger-ghost"
    size?: "sm" | "md" | "lg"
    width?: "sm" | "md" | "lg" | "full"
    loadingText?: string
    showIcon?: boolean
    icon?: React.ComponentType<{ className?: string }>
    text?: string
    // Tooltip props
    tooltip?: string
    tooltipPosition?: "top" | "bottom" | "left" | "right"
    // Keyboard shortcut props
    shortcut?: string
    showShortcut?: boolean
    // Animation props
    disableAnimations?: boolean
    // Theme props
    theme?: "light" | "dark" | "auto"
    // Analytics props
    analyticsEvent?: string
    analyticsData?: Record<string, any>
    // Layout props
    fullWidth?: boolean
}

export function MetaButton({
    isLoading = false,
    disabled = false,
    children,
    className,
    onClick,
    type = "submit",
    variant = "default",
    size = "md",
    width,
    loadingText,
    showIcon = true,
    icon,
    text,
    tooltip,
    tooltipPosition = "top",
    shortcut,
    showShortcut = true,
    disableAnimations = false,
    theme = "auto",
    analyticsEvent,
    analyticsData,
    fullWidth = false
}: MetaButtonProps) {
    const [isClicked, setIsClicked] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [showTooltip, setShowTooltip] = useState(false)

    // Reset clicked state when loading changes
    useEffect(() => {
        if (!isLoading) {
            setIsClicked(false)
        }
    }, [isLoading])

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isLoading || disabled || isClicked) return

        setIsClicked(true)

        // Analytics tracking
        if (analyticsEvent) {
            // In a real app, you'd integrate with your analytics service
            console.log('Analytics Event:', analyticsEvent, analyticsData)
        }

        onClick?.()
    }

    const isDisabled = disabled || isLoading || isClicked

    // Get button text
    const getButtonText = () => {
        if (isLoading) return loadingText || "Processing..."
        if (children) return children
        if (text) return text
        return "Submit"
    }

    // Get icon component
    const getIcon = () => {
        return icon
    }

    // Get size styles
    const getSizeStyles = () => {
        switch (size) {
            case "sm":
                return "h-8 px-3 text-sm"
            case "lg":
                return "h-12 px-6 text-base"
            default:
                return "h-10 px-4 text-sm"
        }
    }

    // Get width styles
    const getWidthStyles = () => {
        if (fullWidth) return "w-full"
        if (width) {
            switch (width) {
                case "sm":
                    return "w-24"
                case "md":
                    return "w-32"
                case "lg":
                    return "w-48"
                case "full":
                    return "w-full"
                default:
                    return ""
            }
        }
        return ""
    }

    // Get variant styles
    const getVariantStyles = () => {
        const isDark = theme === "dark" || (theme === "auto" && typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches)

        // Solid variants
        if (variant === "primary") {
            return isDark
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        }
        if (variant === "secondary") {
            return isDark
                ? "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white"
                : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
        }
        if (variant === "success") {
            return isDark
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
        }
        if (variant === "warning") {
            return isDark
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                : "bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white"
        }
        if (variant === "danger") {
            return isDark
                ? "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
                : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white"
        }

        // Outline variants
        if (variant === "primary-outline") {
            return isDark
                ? "border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
                : "border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
        }
        if (variant === "secondary-outline") {
            return isDark
                ? "border-2 border-slate-400 text-slate-400 hover:bg-slate-400 hover:text-white"
                : "border-2 border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white"
        }
        if (variant === "success-outline") {
            return isDark
                ? "border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white"
                : "border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
        }
        if (variant === "warning-outline") {
            return isDark
                ? "border-2 border-orange-400 text-orange-400 hover:bg-orange-400 hover:text-white"
                : "border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
        }
        if (variant === "danger-outline") {
            return isDark
                ? "border-2 border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                : "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
        }

        // Ghost variants
        if (variant === "primary-ghost") {
            return isDark
                ? "text-blue-400 hover:bg-blue-400/10"
                : "text-blue-600 hover:bg-blue-600/10"
        }
        if (variant === "secondary-ghost") {
            return isDark
                ? "text-slate-400 hover:bg-slate-400/10"
                : "text-slate-600 hover:bg-slate-600/10"
        }
        if (variant === "success-ghost") {
            return isDark
                ? "text-green-400 hover:bg-green-400/10"
                : "text-green-600 hover:bg-green-600/10"
        }
        if (variant === "warning-ghost") {
            return isDark
                ? "text-orange-400 hover:bg-orange-400/10"
                : "text-orange-600 hover:bg-orange-600/10"
        }
        if (variant === "danger-ghost") {
            return isDark
                ? "text-red-400 hover:bg-red-400/10"
                : "text-red-600 hover:bg-red-600/10"
        }

        // Default
        return isDark
            ? "bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white"
            : "bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white"
    }

    const IconComponent = getIcon()

    return (
        <div className="relative inline-block">
            <button
                type={type}
                className={cn(
                    // Base styles
                    "relative rounded-lg font-semibold transition-all duration-300",
                    "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
                    "transform select-none overflow-hidden",

                    // Size styles
                    getSizeStyles(),

                    // Width styles
                    getWidthStyles(),

                    // Variant styles
                    getVariantStyles(),

                    // Hover effects (only when not disabled and animations enabled)
                    !isDisabled && isHovered && !disableAnimations && "hover:shadow-lg hover:shadow-blue-500/25",

                    // Click animation (only when animations enabled)
                    !isDisabled && isClicked && !disableAnimations && "scale-[0.98]",
                    !isDisabled && !disableAnimations && "active:scale-[0.96]",

                    // Disabled styles
                    isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",

                    // Loading state
                    isLoading && "cursor-wait",

                    className
                )}
                disabled={isDisabled}
                onClick={handleClick}
                onMouseEnter={() => {
                    setIsHovered(true)
                    if (tooltip) setShowTooltip(true)
                }}
                onMouseLeave={() => {
                    setIsHovered(false)
                    setShowTooltip(false)
                }}
                aria-disabled={isDisabled}
                title={tooltip}
            >
                {/* Animated background shimmer effect */}
                {!isDisabled && !disableAnimations && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
                )}

                {/* Content container */}
                <div className="relative flex items-center justify-center space-x-2">
                    {isLoading ? (
                        <>
                            {/* Animated loading spinner */}
                            <div className="flex items-center space-x-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                <span className="font-medium">{getButtonText()}</span>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Icon with animation */}
                            <div className="flex items-center space-x-2">
                                {showIcon && IconComponent && (
                                    <IconComponent
                                        className={cn(
                                            "h-4 w-4 transition-all duration-300",
                                            !isDisabled && isHovered && !disableAnimations && "scale-110",
                                            !isDisabled && isClicked && !disableAnimations && "scale-95"
                                        )}
                                    />
                                )}
                                <span className="font-medium">{getButtonText()}</span>
                                {shortcut && showShortcut && (
                                    <span className="text-xs opacity-60 ml-1">
                                        {shortcut}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Progress indicator overlay when clicked */}
                {isClicked && !isLoading && !disableAnimations && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/20 animate-pulse" />
                )}
            </button>

            {/* Tooltip */}
            {tooltip && showTooltip && (
                <div className={cn(
                    "absolute z-50 px-2 py-1 text-sm text-white bg-gray-900 rounded shadow-lg whitespace-nowrap",
                    tooltipPosition === "top" && "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
                    tooltipPosition === "bottom" && "top-full left-1/2 transform -translate-x-1/2 mt-2",
                    tooltipPosition === "left" && "right-full top-1/2 transform -translate-y-1/2 mr-2",
                    tooltipPosition === "right" && "left-full top-1/2 transform -translate-y-1/2 ml-2"
                )}>
                    {tooltip}
                    {/* Tooltip arrow */}
                    <div className={cn(
                        "absolute w-2 h-2 bg-gray-900 transform rotate-45",
                        tooltipPosition === "top" && "top-full left-1/2 transform -translate-x-1/2 -mt-1",
                        tooltipPosition === "bottom" && "bottom-full left-1/2 transform -translate-x-1/2 -mb-1",
                        tooltipPosition === "left" && "left-full top-1/2 transform -translate-y-1/2 -ml-1",
                        tooltipPosition === "right" && "right-full top-1/2 transform -translate-y-1/2 -mr-1"
                    )} />
                </div>
            )}
        </div>
    )
}
