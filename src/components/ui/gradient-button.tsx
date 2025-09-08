"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  children: React.ReactNode
  disabled?: boolean
  variant?: 'default' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({
    className,
    isLoading = false,
    loadingText,
    children,
    disabled = false,
    variant = 'default',
    size = 'md',
    ...props
  }, ref) => {
    const isDisabled = disabled || isLoading

    const variantStyles = {
      default: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
      success: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      warning: "bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700",
      danger: "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700",
    }

    const sizeStyles = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    }

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
          "active:scale-[0.98] transform select-none",

          // Size styles
          sizeStyles[size],

          // Gradient background
          variantStyles[variant],
          "text-white shadow-sm",

          // Hover effects (only when not disabled)
          !isDisabled && "hover:shadow-md hover:shadow-blue-500/25",

          // Disabled styles
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",

          // Loading state
          isLoading && "cursor-wait",

          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <Icons.Loader2 className="h-4 w-4 animate-spin" />
            <span>{loadingText || "Loading..."}</span>
          </div>
        ) : (
          children
        )}
      </button>
    )
  }
)

GradientButton.displayName = "GradientButton"

export { GradientButton, type GradientButtonProps }
