'use client';

import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useApp } from '../lib/context';
import type { Language } from '../lib/types';

interface LanguageSelectionProps {
    currentLanguage?: Language;
    supportedLanguages?: Language[];
}

const DEFAULT_LANGUAGES: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸', isRTL: false },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isRTL: false },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isRTL: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isRTL: false },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', isRTL: false },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', isRTL: false },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱', isRTL: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', isRTL: false },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isRTL: false },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷', isRTL: false },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isRTL: false },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isRTL: true },
];

export function LanguageSelection({
    currentLanguage = DEFAULT_LANGUAGES[0], // Default to English
    supportedLanguages = DEFAULT_LANGUAGES
}: LanguageSelectionProps) {
    const { setLanguage } = useApp();
    const [isOpen, setIsOpen] = useState(false);

    const handleLanguageSelect = (language: Language) => {
        setLanguage(language);
        setIsOpen(false);
    };

    const handleToggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = () => {
        setIsOpen(false);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 relative">
            <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Language Selection</h3>
            </div>

            <div className="relative">
                <button
                    onClick={handleToggleDropdown}
                    className="w-full flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-left hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    type="button"
                >
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{currentLanguage.flag}</span>
                        <div>
                            <div className="font-medium text-gray-900">
                                {currentLanguage.nativeName}
                            </div>
                            <div className="text-sm text-gray-500">
                                {currentLanguage.name}
                            </div>
                        </div>
                    </div>
                    <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
                            }`}
                    />
                </button>

                {isOpen && (
                    <>
                        {/* Overlay to handle clicks outside */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={handleClickOutside}
                        />

                        {/* Dropdown menu */}
                        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {supportedLanguages.map((language) => (
                                <button
                                    key={language.code}
                                    onClick={() => handleLanguageSelect(language)}
                                    className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                                    type="button"
                                >
                                    <span className="text-2xl mr-3">{language.flag}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">
                                            {language.nativeName}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {language.name}
                                        </div>
                                    </div>
                                    {currentLanguage.code === language.code && (
                                        <div className="text-blue-600">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Language change confirmation message */}
            <div className="mt-3 text-sm text-gray-600">
                Language: <span className="font-medium">{currentLanguage.nativeName}</span>
            </div>

            {/* Helpful information */}
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                    💡 <strong>Note:</strong> Generated content will be created in the selected language.
                    Make sure to choose the language that matches your job application requirements.
                </p>
            </div>
        </div>
    );
}
