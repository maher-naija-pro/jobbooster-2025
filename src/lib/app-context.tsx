'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, AppAction, SUPPORTED_LANGUAGES } from './types';

const initialState: AppState = {
    cvData: null,
    language: SUPPORTED_LANGUAGES[0], // English by default
    jobOffer: `We are looking for a skilled DevOps Engineer to join our team and drive the automation, scalability, and reliability of our infrastructure. The ideal candidate will have hands-on experience with cloud platforms (AWS, Azure, or GCP), infrastructure as code (Terraform, Ansible), and CI/CD pipelines (Jenkins, GitLab CI, or GitHub Actions). Strong knowledge of Docker, Kubernetes, and monitoring tools such as Prometheus, Grafana, or ELK is essential, along with a mindset for security and continuous improvement. In this role, you will collaborate closely with developers and operations teams to streamline deployments, implement observability, and ensure resilient, secure, and high-performing systems.`,
    jobAnalysis: null,
    generatedContent: null,
    isGenerating: false,
    generationType: null,
    generationProgress: 0,
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
        case 'CLEAR_GENERATED_CONTENT':
            return { ...state, generatedContent: null };
        case 'START_GENERATION':
            return { ...state, isGenerating: true, generationType: action.payload, generationProgress: 0, error: null };
        case 'STOP_GENERATION':
            return { ...state, isGenerating: false, generationType: null, generationProgress: 0 };
        case 'SET_GENERATION_PROGRESS':
            return { ...state, generationProgress: action.payload };
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
