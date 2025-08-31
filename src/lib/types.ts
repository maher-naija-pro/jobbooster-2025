export interface CVData {
  id: string;
  filename: string;
  size: number;
  uploadDate: Date;
  experience: Experience[];
  education: Education[];
  processedContent: string;
  status: 'processing' | 'completed' | 'error';
}

export interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isRTL: boolean;
}

export interface JobAnalysis {
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
    atsOptimized: boolean;
  };
  exportOptions: ExportFormat[];
}

export interface ExportFormat {
  type: 'pdf' | 'docx' | 'txt';
  filename: string;
  downloadUrl: string;
}

export interface AppState {
  cvData: CVData | null;
  language: Language;
  jobOffer: string;
  jobAnalysis: JobAnalysis | null;
  generatedContent: GeneratedContent | null;
  isGenerating: boolean;
  generationType: 'cover-letter' | 'email' | null;
  generationProgress: number;
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
}

export type AppAction =
  | { type: 'SET_CV_DATA'; payload: CVData }
  | { type: 'CLEAR_CV_DATA' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_JOB_OFFER'; payload: string }
  | { type: 'CLEAR_JOB_OFFER' }
  | { type: 'SET_JOB_ANALYSIS'; payload: JobAnalysis }
  | { type: 'SET_GENERATED_CONTENT'; payload: GeneratedContent }
  | { type: 'CLEAR_GENERATED_CONTENT' }
  | { type: 'START_GENERATION'; payload: 'cover-letter' | 'email' }
  | { type: 'STOP_GENERATION' }
  | { type: 'SET_GENERATION_PROGRESS'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'START_UPLOAD' }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number }
  | { type: 'COMPLETE_UPLOAD' };

export const SUPPORTED_LANGUAGES: Language[] = [
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
