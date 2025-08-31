'use client';

import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
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
            <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Language Selection</h3>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{currentLanguage.flag}</span>
                        <div className="text-left">
                            <p className="font-medium text-gray-900">{currentLanguage.nativeName}</p>
                            <p className="text-sm text-gray-600">{currentLanguage.name}</p>
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {SUPPORTED_LANGUAGES.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageSelect(language)}
                                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 transition-colors text-left first:rounded-t-lg last:rounded-b-lg"
                                >
                                    <span className="text-xl">{language.flag}</span>
                                    <div>
                                        <p className="font-medium text-gray-900">{language.nativeName}</p>
                                        <p className="text-sm text-gray-600">{language.name}</p>
                                    </div>
                                    {language.code === currentLanguage.code && (
                                        <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {currentLanguage.code !== 'en' && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Language changed to {currentLanguage.nativeName}
                </p>
            )}
        </div>
    );
}
