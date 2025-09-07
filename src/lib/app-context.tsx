'use client';

import React, { createContext, useContext, useReducer, ReactNode, useMemo } from 'react';
import { AppState, AppAction, SUPPORTED_LANGUAGES } from './types';

const initialState: AppState = {
    cvData: null,
    language: SUPPORTED_LANGUAGES[0], // English by default
    jobOffer: `We are hiring a DevOps Engineer to join our innovative Telent team, managing CI/CD pipelines and cloud infrastructure (AWS/GCP).
You'll automate deployments using tools like Terraform, Ansible, and orchestrate with Kubernetes.
Hands-on experience with Jenkins, GitLab CI, and scripting in Python/Bash is essential.
Hybrid work model, competitive salary, training, and career growth opportunities provided.
Apply now to be part of digital transformation across telecom and transport sectors.`,
    jobAnalysis: null,
    cvAnalysis: null,
    generatedContent: null,
    isGenerating: false,
    generationType: null,
    generationProgress: 0,
    error: null,
    uploadProgress: 0,
    isUploading: false,
    isAnalyzingCV: false,
    cvAnalysisProgress: 0,
    isAnalyzingJob: false,
    jobAnalysisProgress: 0,
};

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_CV_DATA':
            return { ...state, cvData: action.payload, error: null };
        case 'CLEAR_CV_DATA':
            return { ...state, cvData: null, jobAnalysis: null, cvAnalysis: null };
        case 'SET_LANGUAGE':
            return { ...state, language: action.payload };
        case 'SET_JOB_OFFER':
            return { ...state, jobOffer: action.payload, error: null };
        case 'CLEAR_JOB_OFFER':
            return { ...state, jobOffer: '', jobAnalysis: null };
        case 'SET_JOB_ANALYSIS':
            return { ...state, jobAnalysis: action.payload };
        case 'SET_CV_ANALYSIS':
            return { ...state, cvAnalysis: action.payload, isAnalyzingCV: false, cvAnalysisProgress: 100, error: null };
        case 'CLEAR_CV_ANALYSIS':
            return { ...state, cvAnalysis: null };
        case 'SET_GENERATED_CONTENT':
            return { ...state, generatedContent: action.payload, isGenerating: false, generationType: null };
        case 'CLEAR_GENERATED_CONTENT':
            return { ...state, generatedContent: null };
        case 'START_GENERATION':
            return { ...state, isGenerating: true, generationType: action.payload, generationProgress: 0, error: null };
        case 'STOP_GENERATION':
            return { ...state, isGenerating: false, generationType: null, generationProgress: 0 };
        case 'SET_GENERATION_PROGRESS':
            return { ...state, generationProgress: action.payload };
        case 'START_CV_ANALYSIS':
            return { ...state, isAnalyzingCV: true, cvAnalysisProgress: 0, error: null };
        case 'SET_CV_ANALYSIS_PROGRESS':
            return { ...state, cvAnalysisProgress: action.payload };
        case 'STOP_CV_ANALYSIS':
            return { ...state, isAnalyzingCV: false, cvAnalysisProgress: 0 };
        case 'START_JOB_ANALYSIS':
            return { ...state, isAnalyzingJob: true, jobAnalysisProgress: 0, error: null };
        case 'SET_JOB_ANALYSIS_PROGRESS':
            return { ...state, jobAnalysisProgress: action.payload };
        case 'STOP_JOB_ANALYSIS':
            return { ...state, isAnalyzingJob: false, jobAnalysisProgress: 0 };
        case 'SET_ERROR':
            return { ...state, error: action.payload, isGenerating: false, isAnalyzingCV: false, isAnalyzingJob: false };
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

    const value = useMemo(() => ({
        state,
        dispatch
    }), [state, dispatch]);

    return (
        <AppContext.Provider value={value}>
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
