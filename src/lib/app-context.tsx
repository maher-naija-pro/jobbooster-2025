'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, SUPPORTED_LANGUAGES } from './types';

const initialState: AppState = {
    cvData: null,
    language: SUPPORTED_LANGUAGES[0], // English by default
    jobOffer: '',
    jobAnalysis: null,
    generatedContent: null,
    isGenerating: false,
    generationType: null,
    error: null,
    uploadProgress: 0,
    isUploading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_CV_DATA':
            return { ...state, cvData: action.payload, error: null };
        case 'CLEAR_CV_DATA':
            return { ...state, cvData: null, jobAnalysis: null };
        case 'SET_LANGUAGE':
            return { ...state, language: action.payload };
        case 'SET_JOB_OFFER':
            return { ...state, jobOffer: action.payload, error: null };
        case 'CLEAR_JOB_OFFER':
            return { ...state, jobOffer: '', jobAnalysis: null };
        case 'SET_JOB_ANALYSIS':
            return { ...state, jobAnalysis: action.payload };
        case 'SET_GENERATED_CONTENT':
            return { ...state, generatedContent: action.payload, isGenerating: false, generationType: null };
        case 'START_GENERATION':
            return { ...state, isGenerating: true, generationType: action.payload, error: null };
        case 'STOP_GENERATION':
            return { ...state, isGenerating: false, generationType: null };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isGenerating: false };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        case 'START_UPLOAD':
            return { ...state, isUploading: true, uploadProgress: 0, error: null };
        case 'SET_UPLOAD_PROGRESS':
            return { ...state, uploadProgress: action.payload };
        case 'COMPLETE_UPLOAD':
            return { ...state, isUploading: false, uploadProgress: 100 };
        default:
            return state;
    }
}

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
