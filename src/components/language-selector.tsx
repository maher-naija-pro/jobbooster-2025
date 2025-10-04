'use client';

import React, { useState } from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../lib/types';
import { MetaButton } from './buttons/meta-button';
import { cn } from '@/lib/utils';
import { Icons } from './icons';

interface LanguageSelectorProps {
    currentLanguage: Language;
    onLanguageChange: (language: Language) => void;
    className?: string;
}

export function LanguageSelector({
    currentLanguage,
    onLanguageChange,
    className
}: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageSelect = (language: Language) => {
        onLanguageChange(language);
        setIsOpen(false);
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={cn("relative", className)}>
            {/* Current Language Button */}
            <button
                type="button"
                onClick={toggleOpen}
                className={cn(
                    // Base button styles
                    "relative w-full h-8 px-3 text-sm font-semibold rounded-lg transition-all duration-300",
                    "outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2",
                    "transform select-none overflow-hidden",

                    // Always active styling - primary outline variant
                    "border-2 border-blue-600 text-blue-600 bg-blue-50/50",
                    "ring-2 ring-blue-500/20",

                    // Hover effects for better UX
                    "hover:bg-blue-100/70 hover:border-blue-700 hover:ring-blue-500/30",
                    "hover:shadow-lg hover:shadow-blue-500/25",

                    // Active state (when clicked)
                    "active:scale-[0.98]",

                    // Flex layout
                    "flex items-center justify-between"
                )}
            >
                <div className="flex items-center gap-2">
                    <Icons.globe className="h-4 w-4" />
                    <span className="text-sm">{currentLanguage.flag}</span>
                    <span className="font-medium">{currentLanguage.nativeName}</span>
                </div>

                {/* Active indicator */}
                <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <Icons.down className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isOpen && "rotate-180"
                    )} />
                </div>
            </button>

            {/* Language Options */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {SUPPORTED_LANGUAGES.map((language) => (
                        <button
                            key={language.code}
                            onClick={() => handleLanguageSelect(language)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors",
                                currentLanguage.code === language.code && "bg-blue-50 text-blue-700"
                            )}
                        >
                            <span className="text-lg">{language.flag}</span>
                            <div className="flex-1">
                                <div className="font-medium text-sm">{language.nativeName}</div>
                                <div className="text-xs text-gray-500">{language.name}</div>
                            </div>
                            {currentLanguage.code === language.code && (
                                <Icons.FaCheck className="h-4 w-4 text-blue-600" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
