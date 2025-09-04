import { nanoid } from 'nanoid';

/**
 * Generate a unique anonymous session ID for tracking anonymous users
 * This helps associate multiple uploads from the same anonymous session
 */
export const generateAnonymousSessionId = (): string => {
    return `anon_${nanoid()}`;
};

/**
 * Get or create anonymous session ID from localStorage
 * This persists across page refreshes for anonymous users
 */
export const getAnonymousSessionId = (): string => {
    if (typeof window === 'undefined') {
        return generateAnonymousSessionId();
    }

    const storageKey = 'anonymous_session_id';
    let sessionId = localStorage.getItem(storageKey);

    if (!sessionId) {
        sessionId = generateAnonymousSessionId();
        localStorage.setItem(storageKey, sessionId);
    }

    return sessionId;
};

/**
 * Clear anonymous session (useful when user logs in)
 */
export const clearAnonymousSession = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('anonymous_session_id');
    }
};

/**
 * Check if a user ID is anonymous
 */
export const isAnonymousUser = (userId: string): boolean => {
    return userId.startsWith('anon_') || userId === 'anonymous-user';
};
