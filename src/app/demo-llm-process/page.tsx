'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Upload, FileText, Trash2, CheckCircle, AlertCircle, Loader, Eye, Target, Shield, FileCheck, Database, RefreshCw, Download } from 'lucide-react';
import { cn, validateFile, formatFileSize } from '../../lib/utils';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { getAnonymousSessionId } from '../../lib/anonymous-session';

interface CVUploadState {
    file: File | null;
    isUploading: boolean;
    uploadProgress: number;
    error: string | null;
}

interface CVData {
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    processingStatus: string;
    processingStartedAt?: string;
    processingCompletedAt?: string;
    processingTime?: number;
    processingError?: string;
    extractedText?: string;
    professionalSummary?: string;
    technicalSkills?: any[];
    softSkills?: any[];
    workExperience?: any[];
    education?: any[];
    projects?: any[];
    languages?: any[];
    certifications?: any[];
    completenessScore?: number;
    readabilityScore?: number;
    atsScore?: number;
    createdAt: string;
    updatedAt: string;
    // Additional fields from the API response
    firstName?: string;
    lastName?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    nationality?: string;
    linkedinUrl?: string;
    websiteUrl?: string;
    githubUrl?: string;
    dateOfBirth?: string;
}

interface LLMProcessingResult {
    success: boolean;
    data: CVData;
    analysis: any;
    processingTime: number;
    openaiProcessingTime: number;
}

export default function DemoLLMProcessPage() {
    const [cvUpload, setCvUpload] = useState<CVUploadState>({
        file: null,
        isUploading: false,
        uploadProgress: 0,
        error: null
    });

    const [cvData, setCvData] = useState<CVData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingResult, setProcessingResult] = useState<LLMProcessingResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize anonymous session ID on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const sessionId = getAnonymousSessionId();
            console.log('Initialized anonymous session ID:', sessionId);
        }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const processFile = useCallback(async (file: File) => {
        const validation = validateFile(file);
        if (!validation.isValid) {
            setCvUpload(prev => ({ ...prev, error: validation.error || 'Invalid file' }));
            return;
        }

        setCvUpload(prev => ({ ...prev, file, error: null, isUploading: true, uploadProgress: 0 }));
        setError(null);

        try {
            // Get the anonymous session ID
            const sessionId = getAnonymousSessionId();

            // Upload file first
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/api/upload-cv', {
                method: 'POST',
                headers: {
                    'X-Session-ID': sessionId
                },
                body: formData,
            });

            if (!uploadResponse.ok) {
                const errorData = await uploadResponse.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const uploadResult = await uploadResponse.json();
            setCvData(uploadResult.cvData);
            setCvUpload(prev => ({ ...prev, isUploading: false, uploadProgress: 100 }));

        } catch (err) {
            console.error('File upload failed:', err);
            setCvUpload(prev => ({
                ...prev,
                isUploading: false,
                error: err instanceof Error ? err.message : 'Upload failed'
            }));
        }
    }, []);

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await processFile(files[0]);
        }
    }, [processFile]);

    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await processFile(files[0]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [processFile]);

    const handleLLMProcess = async () => {
        if (!cvData) return;

        setIsProcessing(true);
        setError(null);
        setProcessingResult(null);

        try {
            // Get the anonymous session ID
            const sessionId = getAnonymousSessionId();

            const response = await fetch('/api/cv-data/llm-process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cvId: cvData.id,
                    forceReprocess: true,
                    sessionId: sessionId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'LLM processing failed');
            }

            const result: LLMProcessingResult = await response.json();
            setProcessingResult(result);
            setCvData(result.data); // Update with processed data

        } catch (err) {
            console.error('LLM processing failed:', err);
            setError(err instanceof Error ? err.message : 'LLM processing failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRemoveFile = () => {
        setCvUpload({
            file: null,
            isUploading: false,
            uploadProgress: 0,
            error: null
        });
        setCvData(null);
        setProcessingResult(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getFileExtension = (filename: string | undefined | null) => {
        if (!filename) return 'FILE';
        return filename.split('.').pop()?.toUpperCase() || 'FILE';
    };

    const formatDate = (dateString: string | undefined | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };


    const renderAnalysisData = () => {
        if (!processingResult?.analysis) return null;

        const { analysis } = processingResult;

        return (
            <div className="space-y-4">
                {/* Personal Information */}
                {analysis.personalInfo && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                <div><strong>First Name:</strong> {analysis.personalInfo.firstName || 'N/A'}</div>
                                <div><strong>Last Name:</strong> {analysis.personalInfo.lastName || 'N/A'}</div>
                                <div><strong>Email:</strong> {analysis.personalInfo.email || 'N/A'}</div>
                                <div><strong>Phone:</strong> {analysis.personalInfo.phone || 'N/A'}</div>
                                <div><strong>Nationality:</strong> {analysis.personalInfo.nationality || 'N/A'}</div>
                                <div><strong>LinkedIn:</strong> {analysis.personalInfo.linkedinUrl || 'N/A'}</div>
                                <div><strong>Website:</strong> {analysis.personalInfo.websiteUrl || 'N/A'}</div>
                                <div><strong>GitHub:</strong> {analysis.personalInfo.githubUrl || 'N/A'}</div>
                                <div><strong>Date of Birth:</strong> {analysis.personalInfo.dateOfBirth || 'N/A'}</div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Technical Skills */}
                {analysis.technicalSkills && analysis.technicalSkills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Technical Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analysis.technicalSkills.map((skill: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div>
                                            <span className="font-medium">{skill.name}</span>
                                            <span className="text-sm text-gray-600 ml-2">({skill.category})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{skill.level}</Badge>
                                            {skill.yearsOfExperience && (
                                                <span className="text-xs text-gray-500">{skill.yearsOfExperience} years</span>
                                            )}
                                            {skill.proficiency && (
                                                <span className="text-xs text-gray-500">({skill.proficiency}/10)</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Soft Skills */}
                {analysis.softSkills && analysis.softSkills.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Soft Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analysis.softSkills.map((skill: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div>
                                            <span className="font-medium">{skill.name}</span>
                                            <span className="text-sm text-gray-600 ml-2">({skill.category})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary">{skill.level}</Badge>
                                            {skill.yearsOfExperience && (
                                                <span className="text-xs text-gray-500">{skill.yearsOfExperience} years</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Languages */}
                {analysis.languages && analysis.languages.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Languages</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analysis.languages.map((lang: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <span className="font-medium">{lang.name}</span>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">{lang.proficiency}</Badge>
                                            {lang.certification && (
                                                <span className="text-xs text-gray-500">{lang.certification}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Work Experience */}
                {analysis.workExperience && analysis.workExperience.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Work Experience</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analysis.workExperience.map((exp: any, index: number) => (
                                    <div key={index} className="border-l-4 border-blue-200 pl-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-lg">{exp.title}</h4>
                                                <p className="text-blue-600 font-medium">{exp.company}</p>
                                                <p className="text-sm text-gray-600">
                                                    {exp.startDate} - {exp.endDate || 'Present'}
                                                    {exp.isCurrent && <span className="ml-2 text-green-600">(Current)</span>}
                                                </p>
                                                <p className="text-sm text-gray-500">{exp.location}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm mt-2 text-gray-700">{exp.description}</p>
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <div className="mt-2">
                                                <strong className="text-sm">Key Achievements:</strong>
                                                <ul className="list-disc list-inside mt-1 text-sm text-gray-600">
                                                    {exp.achievements.map((achievement: string, idx: number) => (
                                                        <li key={idx}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {exp.skills && exp.skills.length > 0 && (
                                            <div className="mt-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {exp.skills.map((skill: string, idx: number) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">{skill}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Education */}
                {analysis.education && analysis.education.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Education</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analysis.education.map((edu: any, index: number) => (
                                    <div key={index} className="border-l-4 border-green-200 pl-4">
                                        <h4 className="font-semibold">{edu.degree}</h4>
                                        <p className="text-green-600 font-medium">{edu.institution}</p>
                                        <p className="text-sm text-gray-600">
                                            {edu.fieldOfStudy} • {edu.startDate} - {edu.endDate || 'Present'}
                                        </p>
                                        {edu.location && (
                                            <p className="text-sm text-gray-500">{edu.location}</p>
                                        )}
                                        {edu.description && (
                                            <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Projects */}
                {analysis.projects && analysis.projects.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Projects</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {analysis.projects.map((project: any, index: number) => (
                                    <div key={index} className="border-l-4 border-purple-200 pl-4">
                                        <h4 className="font-semibold">{project.name}</h4>
                                        <p className="text-sm text-gray-700 mt-1">{project.description}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {project.startDate} - {project.endDate || 'Present'}
                                        </p>
                                        {project.technologies && project.technologies.length > 0 && (
                                            <div className="mt-2">
                                                <div className="flex flex-wrap gap-1">
                                                    {project.technologies.map((tech: string, idx: number) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">{tech}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {project.url && (
                                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                                                View Project →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Certifications */}
                {analysis.certifications && analysis.certifications.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Certifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {analysis.certifications.map((cert: any, index: number) => (
                                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                        <div>
                                            <span className="font-medium">{cert.name}</span>
                                            <span className="text-sm text-gray-600 ml-2">({cert.issuer})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{cert.date}</span>
                                            {cert.credentialId && (
                                                <span className="text-xs text-gray-500">ID: {cert.credentialId}</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        LLM Processing Demo
                    </h1>
                    <p className="text-gray-600">
                        Test the CV LLM processing route with drag and drop file upload
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Upload and Controls */}
                    <div className="space-y-6">
                        {/* File Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Upload className="w-5 h-5" />
                                    CV File Upload
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!cvUpload.file && !cvData && (
                                    <div
                                        className={cn(
                                            "relative border-2 border-dashed rounded-lg text-center transition-all duration-300 cursor-pointer min-h-[200px] flex flex-col items-center justify-center group hover:scale-[1.02]",
                                            isDragOver
                                                ? "border-blue-400 bg-blue-50 scale-[1.05]"
                                                : "border-gray-300 hover:border-blue-300 hover:bg-blue-50/50",
                                            cvUpload.error && "border-red-300 bg-red-50"
                                        )}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                        />

                                        <div className="flex flex-col items-center gap-4">
                                            <div className={cn(
                                                "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
                                                isDragOver ? "bg-primary/20 scale-110" : "bg-muted group-hover:bg-primary/10"
                                            )}>
                                                <Target className={cn(
                                                    "w-8 h-8 transition-all duration-300",
                                                    isDragOver ? "text-primary scale-110" : "text-muted-foreground group-hover:text-primary"
                                                )} />
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className={cn(
                                                    "text-lg font-medium transition-colors duration-300",
                                                    isDragOver ? "text-blue-600" : "text-gray-900 group-hover:text-blue-600"
                                                )}>
                                                    {isDragOver ? "Drop to Upload" : "Drop CV/Resume Here"}
                                                </h4>
                                                <p className="text-sm text-gray-600 group-hover:text-gray-700">
                                                    or <span className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors">click to browse</span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PDF, DOC, DOCX (Max 10MB)
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Progress */}
                                {cvUpload.isUploading && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">
                                                    Uploading {cvUpload.file?.name}
                                                </p>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${cvUpload.uploadProgress}%` }}
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {cvUpload.uploadProgress}% complete
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Upload Success */}
                                {cvData && !cvUpload.isUploading && (
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-green-900">
                                                    {cvData.fileName}
                                                </p>
                                                <p className="text-xs text-green-700">
                                                    {cvData.fileSize ? formatFileSize(cvData.fileSize) : 'Unknown size'} • {getFileExtension(cvData.fileName)} • Uploaded successfully
                                                </p>
                                            </div>
                                            <Button
                                                onClick={handleRemoveFile}
                                                variant="ghost"
                                                size="sm"
                                                className="text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Error Display */}
                                {cvUpload.error && (
                                    <Alert className="border-red-200 bg-red-50">
                                        <AlertCircle className="w-4 h-4 text-red-600" />
                                        <AlertDescription className="text-red-700">
                                            {cvUpload.error}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </CardContent>
                        </Card>

                        {/* LLM Processing Controls */}
                        {cvData && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Database className="w-5 h-5" />
                                        LLM Processing
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Badge variant={cvData.processingStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                                            {cvData.processingStatus}
                                        </Badge>
                                        {cvData.processingTime && (
                                            <span className="text-sm text-gray-600">
                                                ({cvData.processingTime}ms)
                                            </span>
                                        )}
                                    </div>

                                    <Button
                                        onClick={handleLLMProcess}
                                        disabled={isProcessing}
                                        className="w-full"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                                Processing with LLM...
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Process with LLM
                                            </>
                                        )}
                                    </Button>

                                    {processingResult && (
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>Total Processing Time:</span>
                                                <span className="font-medium">{processingResult.processingTime}ms</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>OpenAI Processing Time:</span>
                                                <span className="font-medium">{processingResult.openaiProcessingTime}ms</span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Error Display */}
                        {error && (
                            <Alert className="border-red-200 bg-red-50">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <AlertDescription className="text-red-700">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Right Column - Results Display */}
                    <div className="space-y-6">
                        {cvData && (
                            <Tabs defaultValue="database" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="database">Raw JSON Data</TabsTrigger>
                                    <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
                                </TabsList>

                                <TabsContent value="database" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Database className="w-5 h-5" />
                                                Raw LLM API Response
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                                                    {processingResult ? JSON.stringify(processingResult, null, 2) : 'No LLM processing result available'}
                                                </pre>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="analysis" className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Eye className="w-5 h-5" />
                                                LLM Analysis Results
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {processingResult ? (
                                                <div className="max-h-96 overflow-y-auto">
                                                    {renderAnalysisData()}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                    <p>No analysis results yet. Click "Process with LLM" to generate analysis.</p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        )}

                        {!cvData && (
                            <Card>
                                <CardContent className="text-center py-12">
                                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        No CV Data
                                    </h3>
                                    <p className="text-gray-500">
                                        Upload a CV file to see the database table and analysis results.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
