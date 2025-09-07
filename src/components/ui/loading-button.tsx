"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface LoadingButtonProps extends Omit<ComponentProps<typeof Button>, 'disabled'> {
    isLoading?: boolean
    loadingText?: string
    children: React.ReactNode
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
    ({
        className,
        isLoading = false,
        loadingText,
        children,
        onClick,
        ...props
    }, ref) => {
        const [isClicked, setIsClicked] = React.useState(false)

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            if (isLoading || isClicked) return

            setIsClicked(true)
            onClick?.(event)
        }

        // Reset clicked state when loading changes
        React.useEffect(() => {
            if (!isLoading) {
                setIsClicked(false)
            }
        }, [isLoading])

        const isDisabled = isLoading || isClicked

        return (
            <Button
                ref={ref}
                className={cn(className)}
                disabled={isDisabled}
                onClick={handleClick}
                {...props}
            >
                {isDisabled ? (
                    <div className="flex items-center space-x-2">
                        <Icons.Loader2 className="h-4 w-4 animate-spin" />
                        <span>{loadingText || "Loading..."}</span>
                    </div>
                ) : (
                    children
                )}
            </Button>
        )
    }
)

LoadingButton.displayName = "LoadingButton"

export { LoadingButton, type LoadingButtonProps }
