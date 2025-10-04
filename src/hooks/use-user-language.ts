'use client';

import { useEffect, useRef } from 'react';
import { useApp } from '@/lib/app-context';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export function useUserLanguage() {
    const { state, dispatch } = useApp();
    const hasLoadedUserLanguage = useRef(false);

    useEffect(() => {
        const loadUserLanguage = async () => {
            // Only load user language preference on initial load, not on every dispatch change
            if (hasLoadedUserLanguage.current) return;

            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    hasLoadedUserLanguage.current = true;
                    return;
                }

                // Fetch user profile using the existing getProfile action
                const response = await fetch('/api/user/profile');
                if (response.ok) {
                    const profile = await response.json();
                    const preferences = profile?.preferences || {};

                    // Set language preference if available and user hasn't manually changed it
                    if (preferences.language) {
                        const userLanguage = SUPPORTED_LANGUAGES.find(
                            lang => lang.code === preferences.language
                        );
                        if (userLanguage) {
                            // Only set if it's different from current language and we haven't loaded user preferences yet
                            if (userLanguage.code !== state.language.code) {
                                console.log('Loading user language preference:', userLanguage.nativeName);
                                dispatch({ type: 'SET_LANGUAGE', payload: userLanguage });
                            }
                        }
                    }
                }

                hasLoadedUserLanguage.current = true;
            } catch (error) {
                console.error('Error loading user language preference:', error);
                hasLoadedUserLanguage.current = true;
            }
        };

        loadUserLanguage();
    }, []); // Remove dispatch dependency to prevent re-running on every state change
}
