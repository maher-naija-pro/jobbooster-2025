'use client';

import React from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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
    const handleLanguageSelect = (languageCode: string) => {
        const language = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
        if (language) {
            onLanguageChange(language);
        }
    };

    return (
        <div className={className}>
            <Select value={currentLanguage.code} onValueChange={handleLanguageSelect}>
                <SelectTrigger className="w-full h-7 px-1.5 border border-gray-300 rounded hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all duration-300">
                    <SelectValue>
                        <div className="flex items-center gap-1">
                            <span className="text-xs">{currentLanguage.flag}</span>
                            <div className="text-left">
                                <div className="text-xs font-medium text-gray-900">{currentLanguage.nativeName}</div>
                            </div>
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded border shadow-sm">
                    {SUPPORTED_LANGUAGES.map((language) => (
                        <SelectItem
                            key={language.code}
                            value={language.code}
                            className="px-1.5 py-1 hover:bg-gray-50 focus:bg-blue-50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-1">
                                <span className="text-xs">{language.flag}</span>
                                <div className="text-left">
                                    <div className="text-xs font-medium text-gray-900">{language.nativeName}</div>
                                    <div className="text-xs text-gray-600">{language.name}</div>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
