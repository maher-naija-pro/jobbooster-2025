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
                <SelectTrigger className="w-full min-w-[120px] h-8">
                    <SelectValue>
                        <div className="flex items-center gap-1">
                            <span className="text-xs">{currentLanguage.flag}</span>
                            <div className="text-left">
                                <div className="text-xs font-medium text-gray-900">{currentLanguage.nativeName}</div>
                                <div className="text-xs text-gray-500">{currentLanguage.name}</div>
                            </div>
                        </div>
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {SUPPORTED_LANGUAGES.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                            <div className="flex items-center gap-1">
                                <span className="text-xs">{language.flag}</span>
                                <div className="text-left">
                                    <div className="text-xs font-medium text-gray-900">{language.nativeName}</div>
                                    <div className="text-xs text-gray-500">{language.name}</div>
                                </div>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
