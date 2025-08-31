'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, Language, CVData, JobAnalysis, GeneratedContent } from './types';
import { appReducer, initialState } from './reducer';

// Context type
interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;

    // Helper functions for common actions
    setCVUploadState: (state: AppState['cvUploadState'], progress?: number, error?: string) => void;
    setCVData: (cvData: CVData) => void;
    clearCVData: () => void;
    setLanguage: (language: Language) => void;
    setJobContent: (content: string) => void;
    clearJobContent: () => void;
    setJobAnalysisState: (state: AppState['jobAnalysisState'], error?: string) => void;
    setJobAnalysis: (analysis: JobAnalysis) => void;
    setGenerationState: (state: AppState['generationState'], type?: AppState['generationType'], progress?: number, error?: string) => void;
    setGeneratedContent: (content: GeneratedContent) => void;
    clearGeneratedContent: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    resetAppState: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Helper functions
    const setCVUploadState = (state: AppState['cvUploadState'], progress?: number, error?: string) => {
        dispatch({ type: 'SET_CV_UPLOAD_STATE', payload: { state, progress, error } });
    };

    const setCVData = (cvData: CVData) => {
        dispatch({ type: 'SET_CV_DATA', payload: cvData });
    };

    const clearCVData = () => {
        dispatch({ type: 'CLEAR_CV_DATA' });
    };

    const setLanguage = (language: Language) => {
        dispatch({ type: 'SET_LANGUAGE', payload: language });
    };

    const setJobContent = (content: string) => {
        dispatch({ type: 'SET_JOB_CONTENT', payload: content });
    };

    const clearJobContent = () => {
        dispatch({ type: 'CLEAR_JOB_CONTENT' });
    };

    const setJobAnalysisState = (state: AppState['jobAnalysisState'], error?: string) => {
        dispatch({ type: 'SET_JOB_ANALYSIS_STATE', payload: { state, error } });
    };

    const setJobAnalysis = (analysis: JobAnalysis) => {
        dispatch({ type: 'SET_JOB_ANALYSIS', payload: analysis });
    };

    const setGenerationState = (state: AppState['generationState'], type?: AppState['generationType'], progress?: number, error?: string) => {
        dispatch({ type: 'SET_GENERATION_STATE', payload: { state, type, progress, error } });
    };

    const setGeneratedContent = (content: GeneratedContent) => {
        dispatch({ type: 'SET_GENERATED_CONTENT', payload: content });
    };

    const clearGeneratedContent = () => {
        dispatch({ type: 'CLEAR_GENERATED_CONTENT' });
    };

    const setLoading = (loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    };

    const setError = (error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    const resetAppState = () => {
        dispatch({ type: 'RESET_APP_STATE' });
    };

    const value: AppContextType = {
        state,
        dispatch,
        setCVUploadState,
        setCVData,
        clearCVData,
        setLanguage,
        setJobContent,
        clearJobContent,
        setJobAnalysisState,
        setJobAnalysis,
        setGenerationState,
        setGeneratedContent,
        clearGeneratedContent,
        setLoading,
        setError,
        resetAppState,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// Custom hook to use the context
export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

// Export context for advanced use cases
export { AppContext };
