'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Language, SUPPORTED_LANGUAGES } from '../lib/types';

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

    return (
        <div className={className}>
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between px-1.5 py-1 border border-gray-300 rounded-md bg-white hover:border-gray-400 transition-colors w-full min-w-[120px]"
                >
                    <div className="flex items-center gap-1">
                        <span className="text-xs">{currentLanguage.flag}</span>
                        <div className="text-left">
                            <div className="text-xs font-medium text-gray-900">{currentLanguage.nativeName}</div>
                            <div className="text-xs text-gray-500">{currentLanguage.name}</div>
                        </div>
                    </div>
                    <ChevronDown className={`w-2 h-2 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-28 overflow-y-auto">
                            {SUPPORTED_LANGUAGES.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageSelect(language)}
                                    className="w-full flex items-center gap-1 px-1.5 py-1 hover:bg-gray-50 transition-colors text-left first:rounded-t-md last:rounded-b-md"
                                >
                                    <span className="text-xs">{language.flag}</span>
                                    <div className="text-left">
                                        <div className="text-xs font-medium text-gray-900">{language.nativeName}</div>
                                        <div className="text-xs text-gray-500">{language.name}</div>
                                    </div>
                                    {language.code === currentLanguage.code && (
                                        <div className="ml-auto w-1 h-1 bg-blue-600 rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
