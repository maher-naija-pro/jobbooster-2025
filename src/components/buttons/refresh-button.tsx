"use client"

import React from "react"
import { MetaButton } from "./meta-button"
import { Icons } from "@/components/icons"

interface RefreshButtonProps {
    /** Function to call when refresh button is clicked */
    onRefresh: () => void
    /** Whether the refresh operation is currently loading */
    isLoading?: boolean
    /** Custom text for the button */
    text?: string
    /** Button size */
    size?: "sm" | "md" | "lg"
    /** Button variant */
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "default" |
    "primary-outline" | "secondary-outline" | "success-outline" | "warning-outline" | "danger-outline" |
    "primary-ghost" | "secondary-ghost" | "success-ghost" | "warning-ghost" | "danger-ghost"
    /** Button width */
    width?: "auto" | "fit" | "full"
    /** Additional CSS classes */
    className?: string
    /** Tooltip text */
    tooltip?: string
    /** Whether to show the refresh icon */
    showIcon?: boolean
    /** Loading text when refreshing */
    loadingText?: string
    /** Disable the button */
    disabled?: boolean
}

export function RefreshButton({
    onRefresh,
    isLoading = false,
    text = "Refresh",
    size = "md",
    variant = "primary-outline",
    width = "auto",
    className,
    tooltip = "Refresh data",
    showIcon = true,
    loadingText = "Refreshing...",
    disabled = false
}: RefreshButtonProps) {
    return (
        <MetaButton
            onClick={onRefresh}
            isLoading={isLoading}
            text={text}
            size={size}
            variant={variant}
            width={width}
            className={className}
            tooltip={tooltip}
            icon={Icons.refresh}
            showIcon={showIcon}
            loadingText={loadingText}
            disabled={disabled}
            loadingIconType="spinner"
            showLoadingIcon={true}
            showLoadingText={true}
            loadingTextAnimation="pulse"
            loadingSpeed="normal"
        />
    )
}
