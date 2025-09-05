'use client';

import { useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { SUPPORTED_LANGUAGES } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export function useUserLanguage() {
    const { dispatch } = useApp();

    useEffect(() => {
        const loadUserLanguage = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) return;

                // Fetch user profile using the existing getProfile action
                const response = await fetch('/api/user/profile');
                if (response.ok) {
                    const profile = await response.json();
                    const preferences = profile?.preferences || {};

                    // Set language preference if available
                    if (preferences.language) {
                        const userLanguage = SUPPORTED_LANGUAGES.find(
                            lang => lang.code === preferences.language
                        );
                        if (userLanguage) {
                            dispatch({ type: 'SET_LANGUAGE', payload: userLanguage });
                        }
                    }
                }
            } catch (error) {
                console.error('Error loading user language preference:', error);
            }
        };

        loadUserLanguage();
    }, [dispatch]);
}
