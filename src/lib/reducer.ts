import { AppState, AppAction, Language } from './types';

// Default language
const DEFAULT_LANGUAGE: Language = {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    isRTL: false,
};

// Initial state
export const initialState: AppState = {
    // CV Upload State
    cvData: null,
    cvUploadState: 'idle',
    cvUploadProgress: 0,
    cvUploadError: null,

    // Language State
    selectedLanguage: DEFAULT_LANGUAGE,

    // Job Analysis State
    jobContent: '',
    jobAnalysis: null,
    jobAnalysisState: 'idle',
    jobAnalysisError: null,

    // Content Generation State
    generationState: 'idle',
    generationType: null,
    generationProgress: 0,
    generatedContent: null,
    generationError: null,

    // UI State
    isLoading: false,
    error: null,
};

// Reducer function
export function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_CV_UPLOAD_STATE':
            return {
                ...state,
                cvUploadState: action.payload.state,
                cvUploadProgress: action.payload.progress ?? 0,
                cvUploadError: action.payload.error ?? null,
            };

        case 'SET_CV_DATA':
            return {
                ...state,
                cvData: action.payload,
                cvUploadState: 'success',
                cvUploadProgress: 100,
                cvUploadError: null,
            };

        case 'CLEAR_CV_DATA':
            return {
                ...state,
                cvData: null,
                cvUploadState: 'idle',
                cvUploadProgress: 0,
                cvUploadError: null,
            };

        case 'SET_LANGUAGE':
            return {
                ...state,
                selectedLanguage: action.payload,
            };

        case 'SET_JOB_CONTENT':
            return {
                ...state,
                jobContent: action.payload,
                // Reset job analysis when content changes
                jobAnalysis: null,
                jobAnalysisState: 'idle',
                jobAnalysisError: null,
                // Reset generation when job content changes
                generationState: 'idle',
                generationType: null,
                generatedContent: null,
                generationError: null,
            };

        case 'CLEAR_JOB_CONTENT':
            return {
                ...state,
                jobContent: '',
                jobAnalysis: null,
                jobAnalysisState: 'idle',
                jobAnalysisError: null,
                generationState: 'idle',
                generationType: null,
                generatedContent: null,
                generationError: null,
            };

        case 'SET_JOB_ANALYSIS_STATE':
            return {
                ...state,
                jobAnalysisState: action.payload.state,
                jobAnalysisError: action.payload.error ?? null,
            };

        case 'SET_JOB_ANALYSIS':
            return {
                ...state,
                jobAnalysis: action.payload,
                jobAnalysisState: 'complete',
                jobAnalysisError: null,
            };

        case 'SET_GENERATION_STATE':
            return {
                ...state,
                generationState: action.payload.state,
                generationType: action.payload.type ?? null,
                generationProgress: action.payload.progress ?? 0,
                generationError: action.payload.error ?? null,
            };

        case 'SET_GENERATED_CONTENT':
            return {
                ...state,
                generatedContent: action.payload,
                generationState: 'success',
                generationProgress: 100,
                generationError: null,
            };

        case 'CLEAR_GENERATED_CONTENT':
            return {
                ...state,
                generatedContent: null,
                generationState: 'idle',
                generationType: null,
                generationProgress: 0,
                generationError: null,
            };

        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload,
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
            };

        case 'RESET_APP_STATE':
            return initialState;

        default:
            return state;
    }
}
