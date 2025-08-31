// App State Types
export interface CVData {
    id: string;
    filename: string;
    size: number;
    uploadDate: Date;
    extractedSkills: string[];
    processedContent: string;
}

export interface Language {
    code: string;
    name: string;
    nativeName: string;
    flag: string;
    isRTL: boolean;
}

export interface JobAnalysis {
    skills: string[];
    experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
    industry: string;
    requirements: string[];
    companySize: string;
    location: string;
    salaryRange?: string;
    keywords: string[];
}

export interface GeneratedContent {
    id: string;
    type: 'cover-letter' | 'email';
    language: string;
    content: string;
    metadata: {
        wordCount: number;
        estimatedReadTime: number;
        skillsHighlighted: string[];
        atsOptimized: boolean;
        type?: 'application' | 'follow-up' | 'inquiry';
        subject?: string;
    };
    exportOptions: {
        type: 'pdf' | 'docx' | 'txt';
        filename: string;
        downloadUrl: string;
    }[];
    generatedAt?: string;
    processingTime?: number;
}

export interface AppState {
    // CV Upload State
    cvData: CVData | null;
    cvUploadState: 'idle' | 'uploading' | 'processing' | 'success' | 'error';
    cvUploadProgress: number;
    cvUploadError: string | null;

    // Language State
    selectedLanguage: Language;

    // Job Analysis State
    jobContent: string;
    jobAnalysis: JobAnalysis | null;
    jobAnalysisState: 'idle' | 'analyzing' | 'complete' | 'error';
    jobAnalysisError: string | null;

    // Content Generation State
    generationState: 'idle' | 'generating' | 'success' | 'error';
    generationType: 'letter' | 'email' | null;
    generationProgress: number;
    generatedContent: GeneratedContent | null;
    generationError: string | null;

    // UI State
    isLoading: boolean;
    error: string | null;
}

// Action Types
export type AppAction =
    | { type: 'SET_CV_UPLOAD_STATE'; payload: { state: AppState['cvUploadState']; progress?: number; error?: string } }
    | { type: 'SET_CV_DATA'; payload: CVData }
    | { type: 'CLEAR_CV_DATA' }
    | { type: 'SET_LANGUAGE'; payload: Language }
    | { type: 'SET_JOB_CONTENT'; payload: string }
    | { type: 'CLEAR_JOB_CONTENT' }
    | { type: 'SET_JOB_ANALYSIS_STATE'; payload: { state: AppState['jobAnalysisState']; error?: string } }
    | { type: 'SET_JOB_ANALYSIS'; payload: JobAnalysis }
    | { type: 'SET_GENERATION_STATE'; payload: { state: AppState['generationState']; type?: AppState['generationType']; progress?: number; error?: string } }
    | { type: 'SET_GENERATED_CONTENT'; payload: GeneratedContent }
    | { type: 'CLEAR_GENERATED_CONTENT' }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'RESET_APP_STATE' };
