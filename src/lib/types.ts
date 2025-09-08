export interface CVData {
  id: string;
  filename: string;
  size: number;
  uploadDate: Date;
  processedContent: string;
  status: 'processing' | 'completed' | 'error';
  fileUrl?: string;

  // Processing & Analysis Fields
  processingStatus?: 'uploaded' | 'extracting' | 'analyzing' | 'completed' | 'failed' | 'archived';
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  processingError?: string;
  processingTime?: number; // Processing time in milliseconds
  modelUsed?: string; // AI model used for analysis
  parameters?: Record<string, any>; // Analysis parameters used
  errorMessage?: string; // Specific error message if analysis failed
  analysisId?: string;
  analysisVersion?: string;

  // Enhanced Metadata Fields
  originalFilename?: string;

  // CV-Specific Extracted Data Fields
  extractedSkills?: string[]; // Array of skills extracted from CV
  extractedExperience?: number; // Years of experience extracted
  extractedEducation?: Record<string, any>; // Education details (degrees, institutions)
  extractedCertifications?: Record<string, any>; // Professional certifications found
  extractedLanguages?: string[]; // Languages mentioned in CV

  // Job-Related Fields (from job_data table)
  company?: string; // Company name
  requiredQualifications?: string[]; // Required qualifications
  preferredQualifications?: string[]; // Preferred qualifications

  // Job-Specific Metadata Fields (from job_data table)
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship'; // Type of employment
  location?: string; // Job location
  remoteType?: 'remote' | 'hybrid' | 'onsite'; // Remote work type
  salaryRange?: string; // Salary range
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive'; // Required experience level
  industry?: string; // Industry sector
  department?: string; // Department
  employmentType?: string; // Employment type

  // User Interaction Tracking
  viewCount?: number;
  lastAnalyzedAt?: Date;
  analysisCount?: number;

  // Security & Compliance Fields
  isPublic?: boolean;
  isActive?: boolean; // Whether CV is still active/current
  retentionDate?: Date;
  gdprConsent?: boolean;
  dataClassification?: 'public' | 'internal' | 'confidential';

  // Performance & Optimization Fields
  isArchived?: boolean;
  archiveDate?: Date;
}

export interface JobData {
  id: string;
  userId: string;
  content: string;
  title?: string;
  company?: string;
  status: string;

  // Processing & Analysis Fields
  processingStatus: 'uploaded' | 'extracting' | 'analyzing' | 'completed' | 'failed';
  processingStartedAt?: Date;
  processingCompletedAt?: Date;
  processingError?: string;
  processingTime?: number;
  modelUsed?: string;
  parameters?: any;
  errorMessage?: string;
  analysisId?: string;
  analysisVersion?: string;

  // Extracted Data Fields
  extractedSkills?: string[];
  requiredQualifications?: string[];
  preferredQualifications?: string[];

  // CV-Related Fields (from cv_data table)
  extractedExperience?: number; // Years of experience extracted
  extractedEducation?: Record<string, any>; // Education details (degrees, institutions)
  extractedCertifications?: Record<string, any>; // Professional certifications found
  extractedLanguages?: string[]; // Languages mentioned
  originalFilename?: string; // Original filename
  metadata?: Record<string, any>; // Additional metadata

  // Job-Specific Metadata Fields
  jobType?: 'full-time' | 'part-time' | 'contract' | 'internship';
  location?: string;
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  salaryRange?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  industry?: string;
  department?: string;
  employmentType?: string;

  // User Interaction Tracking
  viewCount: number;
  lastAnalyzedAt?: Date;
  analysisCount: number;

  // Security & Compliance Fields
  isPublic: boolean;
  retentionDate?: Date;
  gdprConsent: boolean;
  isActive: boolean;
  dataClassification?: 'public' | 'internal' | 'confidential';

  // Performance & Optimization Fields
  isArchived: boolean;
  archiveDate?: Date;

  // Standard Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
}

export interface SkillsData {
  technical?: string[];
  soft?: string[];
  languages?: string[];
  certifications?: string[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
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
  companyName: string;
  requirements: string[];
  companySize: string;
  location: string;
  salaryRange?: string;
  keywords: string[];
}

export interface CVAnalysis {
  id: string;
  cvId: string;
  analysisDate: Date;
  status: 'processing' | 'completed' | 'error';
  skills: ExtractedSkill[];
  experience: ExperienceAnalysis[];
  education: EducationAnalysis[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallScore: number;
  metadata: {
    processingTime: number;
    confidence: number;
    version: string;
  };
}

export interface ExtractedSkill {
  name: string;
  category: 'technical' | 'soft' | 'language' | 'certification' | 'tool';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  confidence: number;
  context: string[];
  yearsOfExperience?: number;
}

export interface ExperienceAnalysis {
  title: string;
  company: string;
  duration: string;
  description: string;
  skills: string[];
  achievements: string[];
  relevanceScore: number;
}

export interface EducationAnalysis {
  degree: string;
  institution: string;
  year: string;
  relevance: 'high' | 'medium' | 'low';
  skills: string[];
}

export interface SkillMatch {
  skill: string;
  cvLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  jobRequirement: 'required' | 'preferred' | 'optional';
  matchScore: number;
  gap: 'none' | 'minor' | 'moderate' | 'major';
  recommendation: string;
}

export interface CVAnalysisResult {
  analysis: CVAnalysis;
  jobMatch: {
    overallMatch: number;
    skillMatches: SkillMatch[];
    missingSkills: string[];
    strengths: string[];
    recommendations: string[];
  };
}

export interface GeneratedContent {
  id: string;
  type: 'cover-letter' | 'email' | 'cv-analysis';
  language: string;
  content: string;
  metadata: {
    wordCount: number;
    estimatedReadTime: number;
    atsOptimized: boolean;
  };
  exportOptions: ExportFormat[];
  // For CV analysis, store the structured data
  analysisData?: CVAnalysisResult;
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
  cvAnalysis: CVAnalysisResult | null;
  generatedContent: GeneratedContent | null;
  isGenerating: boolean;
  generationType: 'cover-letter' | 'email' | 'cv-analysis' | null;
  generationProgress: number;
  error: string | null;
  uploadProgress: number;
  isUploading: boolean;
  isAnalyzingCV: boolean;
  cvAnalysisProgress: number;
  isAnalyzingJob: boolean;
  jobAnalysisProgress: number;
  isTestMode: boolean;
}

export type AppAction =
  | { type: 'SET_CV_DATA'; payload: CVData }
  | { type: 'CLEAR_CV_DATA' }
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_JOB_OFFER'; payload: string }
  | { type: 'CLEAR_JOB_OFFER' }
  | { type: 'SET_JOB_ANALYSIS'; payload: JobAnalysis }
  | { type: 'SET_CV_ANALYSIS'; payload: CVAnalysisResult }
  | { type: 'CLEAR_CV_ANALYSIS' }
  | { type: 'SET_GENERATED_CONTENT'; payload: GeneratedContent }
  | { type: 'CLEAR_GENERATED_CONTENT' }
  | { type: 'START_GENERATION'; payload: 'cover-letter' | 'email' | 'cv-analysis' }
  | { type: 'STOP_GENERATION' }
  | { type: 'SET_GENERATION_PROGRESS'; payload: number }
  | { type: 'START_CV_ANALYSIS' }
  | { type: 'SET_CV_ANALYSIS_PROGRESS'; payload: number }
  | { type: 'STOP_CV_ANALYSIS' }
  | { type: 'START_JOB_ANALYSIS' }
  | { type: 'SET_JOB_ANALYSIS_PROGRESS'; payload: number }
  | { type: 'STOP_JOB_ANALYSIS' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'START_UPLOAD' }
  | { type: 'SET_UPLOAD_PROGRESS'; payload: number }
  | { type: 'COMPLETE_UPLOAD' }
  | { type: 'TOGGLE_TEST_MODE' };

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
