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
                <SelectTrigger className="w-full h-10 px-3 border-2 border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300">
                    <SelectValue>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">{currentLanguage.flag}</span>
                            <div className="text-left">
                                <div className="text-xs font-semibold text-gray-900">{currentLanguage.nativeName}</div>
                                <div className="text-xs text-gray-600">{currentLanguage.name}</div>
                            </div>
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-lg border-2 shadow-md">
                    {SUPPORTED_LANGUAGES.map((language) => (
                        <SelectItem
                            key={language.code}
                            value={language.code}
                            className="px-3 py-2 hover:bg-gray-50 focus:bg-blue-50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-sm">{language.flag}</span>
                                <div className="text-left">
                                    <div className="text-xs font-semibold text-gray-900">{language.nativeName}</div>
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
