import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode
}

export const CardWrapper = React.forwardRef<HTMLDivElement, CardWrapperProps>(
    ({ className, children, ...props }, ref) => {
        return (
            <Card
                ref={ref}
                className={cn("w-full max-w-md mx-auto", className)}
                {...props}
            >
                {children}
            </Card>
        )
    }
)

CardWrapper.displayName = "CardWrapper"
