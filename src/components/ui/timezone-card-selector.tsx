'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import ReactCountryFlag from 'react-country-flag'

interface TimezoneCardSelectorProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

const TIMEZONES = [
  { value: 'UTC', label: 'UTC', description: 'Coordinated Universal Time', countryCode: 'UN' },
  { value: 'America/New_York', label: 'Eastern Time (ET)', description: 'New York, Miami', countryCode: 'US' },
  { value: 'America/Chicago', label: 'Central Time (CT)', description: 'Chicago, Dallas', countryCode: 'US' },
  { value: 'America/Denver', label: 'Mountain Time (MT)', description: 'Denver, Phoenix', countryCode: 'US' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)', description: 'Los Angeles, Seattle', countryCode: 'US' },
  { value: 'Europe/London', label: 'London (GMT)', description: 'London, Dublin', countryCode: 'GB' },
  { value: 'Europe/Paris', label: 'Paris (CET)', description: 'Paris, Berlin', countryCode: 'FR' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)', description: 'Berlin, Amsterdam', countryCode: 'DE' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)', description: 'Tokyo, Seoul', countryCode: 'JP' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)', description: 'Shanghai, Beijing', countryCode: 'CN' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)', description: 'Sydney, Melbourne', countryCode: 'AU' },
]

export function TimezoneCardSelector({
  value,
  onChange,
  disabled = false,
  className
}: TimezoneCardSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedTimezone = TIMEZONES.find(tz => tz.value === value) || TIMEZONES[0]

  const handleSelect = (timezoneValue: string) => {
    onChange(timezoneValue)
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
              <ReactCountryFlag
                countryCode={selectedTimezone.countryCode}
                svg
                style={{
                  width: '20px',
                  height: '15px',
                  borderRadius: '2px'
                }}
                title={selectedTimezone.label}
              />
              <div>
                <div className="font-medium text-xs">{selectedTimezone.label}</div>
                <div className="text-xs text-muted-foreground">{selectedTimezone.description}</div>
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
          {TIMEZONES.map((timezone) => (
            <Card
              key={timezone.value}
              className={cn(
                "cursor-pointer transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
                value === timezone.value && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleSelect(timezone.value)}
            >
              <CardContent className="p-2">
                <div className="flex items-center gap-2">
                  <ReactCountryFlag
                    countryCode={timezone.countryCode}
                    svg
                    style={{
                      width: '18px',
                      height: '13px',
                      borderRadius: '2px'
                    }}
                    title={timezone.label}
                  />
                  <div>
                    <div className="font-medium text-xs">{timezone.label}</div>
                    <div className="text-xs text-muted-foreground">{timezone.description}</div>
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
