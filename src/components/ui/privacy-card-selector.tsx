'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PrivacyCardSelectorProps {
    value?: string
    onChange: (value: string) => void
    disabled?: boolean
    className?: string
}

const PRIVACY_OPTIONS = [
    {
        value: 'public',
        label: 'Public',
        description: 'Your profile is visible to everyone',
        icon: '🌐'
    },
    {
        value: 'private',
        label: 'Private',
        description: 'Your profile is only visible to you',
        icon: '🔒'
    },
]

export function PrivacyCardSelector({
    value,
    onChange,
    disabled = false,
    className
}: PrivacyCardSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    const selectedOption = PRIVACY_OPTIONS.find(option => option.value === value) || PRIVACY_OPTIONS[1]

    const handleSelect = (optionValue: string) => {
        onChange(optionValue)
        setIsOpen(false)
    }

    return (
        <div className={cn("relative", className)}>
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-200 hover:shadow-sm",
          isOpen && "ring-1 ring-primary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <CardContent className="p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{selectedOption.icon}</span>
              <div>
                <div className="font-medium text-xs">{selectedOption.label}</div>
                <div className="text-xs text-muted-foreground">{selectedOption.description}</div>
              </div>
            </div>
            <div className={cn(
              "transition-transform duration-200",
              isOpen && "rotate-180"
            )}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-md">
          {PRIVACY_OPTIONS.map((option) => (
            <Card
              key={option.value}
              className={cn(
                "cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
                value === option.value && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSelect(option.value)}
            >
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{option.icon}</span>
                  <div>
                    <div className="font-medium text-xs">{option.label}</div>
                    <div className="text-xs text-muted-foreground">{option.description}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
        </div>
    )
}
