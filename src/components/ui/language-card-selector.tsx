'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SUPPORTED_LANGUAGES } from '@/lib/types'
import { cn } from '@/lib/utils'

interface LanguageCardSelectorProps {
    value?: string
    onChange: (value: string) => void
    disabled?: boolean
    className?: string
}

export function LanguageCardSelector({
    value,
    onChange,
    disabled = false,
    className
}: LanguageCardSelectorProps) {
    const [isOpen, setIsOpen] = useState(false)

    const selectedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === value) || SUPPORTED_LANGUAGES[0]

    const handleSelect = (languageCode: string) => {
        onChange(languageCode)
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
              <span className="text-lg">{selectedLanguage.flag}</span>
              <div>
                <div className="font-medium text-xs">{selectedLanguage.nativeName}</div>
                <div className="text-xs text-muted-foreground">{selectedLanguage.name}</div>
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
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-background border rounded-md shadow-md max-h-48 overflow-y-auto">
          {SUPPORTED_LANGUAGES.map((language) => (
            <Card
              key={language.code}
              className={cn(
                "cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
                value === language.code && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSelect(language.code)}
            >
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{language.flag}</span>
                  <div>
                    <div className="font-medium text-xs">{language.nativeName}</div>
                    <div className="text-xs text-muted-foreground">{language.name}</div>
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
