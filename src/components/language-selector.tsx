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
                <SelectTrigger className="w-full h-12 px-4 border-2 border-gray-300 rounded-xl hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300">
                    <SelectValue>
                        <div className="flex items-center gap-3">
                            <span className="text-lg">{currentLanguage.flag}</span>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-gray-900">{currentLanguage.nativeName}</div>
                                <div className="text-xs text-gray-600">{currentLanguage.name}</div>
                            </div>
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl border-2 shadow-lg">
                    {SUPPORTED_LANGUAGES.map((language) => (
                        <SelectItem
                            key={language.code}
                            value={language.code}
                            className="px-4 py-3 hover:bg-gray-50 focus:bg-blue-50 transition-colors duration-200"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg">{language.flag}</span>
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-gray-900">{language.nativeName}</div>
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
