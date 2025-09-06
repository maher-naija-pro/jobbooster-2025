'use client';

import { useApp } from '../lib/app-context';
import { CVUpload } from '../components/cv-upload';
import { LanguageSelector } from '../components/language-selector';
import { JobOfferInput } from '../components/job-offer-input';
import { ActionButtons } from '../components/action-buttons';
import { ContentGenerator } from '../components/content-generator';
import { useUserLanguage } from '../hooks/use-user-language';

import { ErrorBoundary } from '../components/error-boundary';
import { Language } from '../lib/types';
import { useState } from 'react';
import { FeatureGate } from '../components/auth/feature-gate';
import Link from 'next/link';
import { Button } from '../components/ui/button';
import { Database } from 'lucide-react';

export default function Home() {
  const { state, dispatch } = useApp();
  const [streamingContent, setStreamingContent] = useState('');
  const [debugApiResponse, setDebugApiResponse] = useState<any>(null);

  // Load user's language preference
  useUserLanguage();

  // Store the current abort controller for cancellation
  const [currentAbortController, setCurrentAbortController] = useState<AbortController | null>(null);

  const handleFileUpload = async (file: File) => {
    try {
      dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'START_UPLOAD' });

      return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('file', file);

        // Track upload progress
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const progress = Math.round((event.loaded / event.total) * 100);
            dispatch({ type: 'SET_UPLOAD_PROGRESS', payload: progress });
          }
        });

        // Handle response
        xhr.addEventListener('load', async () => {
          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);

              // Create CVData object
              const cvData = {
                ...result.cvData,
                uploadDate: new Date(result.cvData.uploadDate),
                status: 'processing' as const,
              };

              dispatch({ type: 'COMPLETE_UPLOAD' });
              dispatch({ type: 'SET_CV_DATA', payload: cvData });

              // Simulate processing time (in real app, this would be actual processing)
              setTimeout(() => {
                dispatch({
                  type: 'SET_CV_DATA',
                  payload: { ...cvData, status: 'completed' as const }
                });
              }, 2000);
              resolve();
            } catch (error) {
              console.error('Failed to parse response:', error);
              dispatch({ type: 'SET_ERROR', payload: 'Failed to process uploaded file. Please try again.' });
              reject(error);
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              dispatch({ type: 'SET_ERROR', payload: error.error });
            } catch {
              dispatch({ type: 'SET_ERROR', payload: 'Upload failed. Please try again.' });
            }
            reject(new Error('Upload failed'));
          }
        });

        // Handle network errors
        xhr.addEventListener('error', () => {
          dispatch({ type: 'SET_ERROR', payload: 'Network error. Please check your connection and try again.' });
          reject(new Error('Network error'));
        });

        // Handle timeout
        xhr.addEventListener('timeout', () => {
          dispatch({ type: 'SET_ERROR', payload: 'Upload timeout. Please try again.' });
          reject(new Error('Upload timeout'));
        });

        // Open and send request
        xhr.open('POST', '/api/upload-cv');
        xhr.timeout = 30000; // 30 second timeout
        xhr.send(formData);
      });

    } catch (error) {
      console.error('File upload failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to upload file. Please try again.' });
    }
  };

  const handleFileRemove = () => {
    dispatch({ type: 'CLEAR_CV_DATA' });
  };

  const handleLanguageChange = (language: Language) => {
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  const handleJobOfferChange = (value: string) => {
    dispatch({ type: 'SET_JOB_OFFER', payload: value });
  };

  const handleJobOfferClear = () => {
    dispatch({ type: 'CLEAR_JOB_OFFER' });
  };

  const handleStreamingGeneration = async (type: 'cover-letter' | 'email') => {
    if (!state.cvData || !state.jobOffer) return;

    dispatch({ type: 'START_GENERATION', payload: type });
    setStreamingContent('');

    // Create AbortController for this request
    const abortController = new AbortController();

    // Store the abort controller so we can cancel it later
    setCurrentAbortController(abortController);

    try {
      const endpoint = type === 'cover-letter' ? '/api/generate-letter' : '/api/generate-email';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: state.cvData,
          jobOffer: state.jobOffer,
          language: state.language,
          type: type === 'email' ? 'application' : undefined,
        }),
        signal: abortController.signal, // Add abort signal
      });

      if (!response.ok) {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.error });
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let fullContent = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.content) {
                    fullContent += data.content;
                    setStreamingContent(fullContent);
                  }
                  if (data.done) {
                    // Create generated content object
                    const generatedContent = {
                      id: `gen_${Date.now()}`,
                      type,
                      language: state.language.code,
                      content: fullContent,
                      metadata: {
                        wordCount: fullContent.split(' ').length,
                        estimatedReadTime: Math.ceil(fullContent.split(' ').length / 200),
                        atsOptimized: true,
                      },
                      exportOptions: [
                        { type: 'pdf' as const, filename: `${type}-generated.pdf`, downloadUrl: '#' },
                        { type: 'docx' as const, filename: `${type}-generated.docx`, downloadUrl: '#' },
                        { type: 'txt' as const, filename: `${type}-generated.txt`, downloadUrl: '#' },
                      ],
                    };

                    dispatch({ type: 'SET_GENERATED_CONTENT', payload: generatedContent });
                    break;
                  }
                } catch {
                  // Skip malformed JSON
                }
              }
            }
          }
        } catch (error) {
          // Check if this is an abort error
          if (error instanceof Error && error.name === 'AbortError') {
            console.log('Generation was aborted by user');
            return; // Exit gracefully without setting error
          }
          throw error; // Re-throw other errors
        } finally {
          reader.releaseLock();
        }
      }
    } catch (error) {
      // Check if this is an abort error
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Generation was aborted by user');
        return; // Exit gracefully without setting error
      }

      console.error('Generation failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate content. Please try again.' });
    } finally {
      // Clean up the abort controller reference
      setCurrentAbortController(null);
    }
  };

  const handleGenerateLetter = () => {
    // Clear any existing generated content before starting new generation
    dispatch({ type: 'CLEAR_GENERATED_CONTENT' });
    setStreamingContent('');
    handleStreamingGeneration('cover-letter');
  };

  const handleGenerateMail = () => {
    // Clear any existing generated content before starting new generation
    dispatch({ type: 'CLEAR_GENERATED_CONTENT' });
    setStreamingContent('');
    handleStreamingGeneration('email');
  };

  const handleAnalyzeCV = async () => {
    if (!state.cvData || !state.jobOffer) return;

    // Clear any existing generated content before starting new analysis
    dispatch({ type: 'CLEAR_GENERATED_CONTENT' });
    setStreamingContent('');

    dispatch({ type: 'START_GENERATION', payload: 'cv-analysis' });
    dispatch({ type: 'START_CV_ANALYSIS' });
    setDebugApiResponse(null); // Clear previous debug data

    try {
      console.log('Starting CV analysis with data:', {
        cvData: state.cvData,
        jobOffer: state.jobOffer,
        language: state.language,
      });

      const response = await fetch('/api/analyze-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: state.cvData,
          jobOffer: state.jobOffer,
          language: state.language,
        }),
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error response:', error);
        dispatch({ type: 'SET_ERROR', payload: error.error });
        return;
      }

      const result = await response.json();
      console.log('API Success response:', result);
      console.log('Result structure:', {
        hasResult: !!result.result,
        resultKeys: result.result ? Object.keys(result.result) : [],
        resultType: typeof result.result,
      });

      // Store debug data
      setDebugApiResponse(result);

      // Extract and store job analysis if available
      if (result.jobAnalysis) {
        console.log('Storing job analysis:', result.jobAnalysis);
        dispatch({ type: 'SET_JOB_ANALYSIS', payload: result.jobAnalysis });
      }

      // Create a GeneratedContent object for CV analysis
      const generatedContent = {
        id: `cv-analysis-${Date.now()}`,
        type: 'cv-analysis' as const,
        language: state.language.code,
        content: `CV Analysis completed with ${result.result.jobMatch.overallMatch}% match score`,
        metadata: {
          wordCount: 0,
          estimatedReadTime: 0,
          atsOptimized: false,
        },
        exportOptions: [],
        analysisData: result.result,
      };

      dispatch({ type: 'SET_GENERATED_CONTENT', payload: generatedContent });

    } catch (error) {
      console.error('CV analysis failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to analyze CV. Please try again.' });
    } finally {
      dispatch({ type: 'STOP_GENERATION' });
      dispatch({ type: 'STOP_CV_ANALYSIS' });
    }
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit content');
  };

  const handleRegenerate = () => {
    if (state.generationType && (state.generationType === 'cover-letter' || state.generationType === 'email')) {
      handleStreamingGeneration(state.generationType);
    } else if (state.generationType === 'cv-analysis') {
      handleAnalyzeCV();
    }
  };

  const handleDownload = (format: 'pdf' | 'docx' | 'txt') => {
    // TODO: Implement actual download functionality
    console.log('Download as', format);
  };

  const handleRegenerateAnalysis = () => {
    handleAnalyzeCV();
  };

  const handleDownloadAnalysis = () => {
    // TODO: Implement CV analysis download functionality
    console.log('Download CV analysis');
  };

  const handleStopGeneration = () => {
    if (state.isGenerating) {
      // Abort the current fetch request if it exists
      if (currentAbortController) {
        currentAbortController.abort();
      }

      // Stop the current generation process
      dispatch({ type: 'STOP_GENERATION' });

      // Preserve the content that was already generated by converting streaming content to generated content
      if (streamingContent.trim() && state.generationType) {
        const partialContent = {
          id: `gen_${Date.now()}_partial`,
          type: state.generationType,
          language: state.language.code,
          content: streamingContent.trim(),
          metadata: {
            wordCount: streamingContent.trim().split(' ').length,
            estimatedReadTime: Math.ceil(streamingContent.trim().split(' ').length / 200),
            atsOptimized: false, // Mark as partial since it was stopped
          },
          exportOptions: [
            { type: 'pdf' as const, filename: `${state.generationType}-partial.pdf`, downloadUrl: '#' },
            { type: 'docx' as const, filename: `${state.generationType}-partial.docx`, downloadUrl: '#' },
            { type: 'txt' as const, filename: `${state.generationType}-partial.txt`, downloadUrl: '#' },
          ],
        };

        dispatch({ type: 'SET_GENERATED_CONTENT', payload: partialContent });
      }

      console.log('Generation stopped by user');
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8">
      {/* Demo Link */}
      <div className="flex justify-end pt-4">
        <Link href="/demo-llm-process">
          <Button variant="outline" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            LLM Processing Demo
          </Button>
        </Link>
      </div>

      <div className="w-full">
        {/* Conditional Layout - Centered when no content, two-column when generating or has results */}
        {!state.isGenerating && !state.generatedContent && !state.cvAnalysis ? (
          // Centered layout for initial state
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-5">
                <div className="space-y-2">
                  {/* CV Upload - Centered */}
                  <CVUpload
                    onFileUpload={handleFileUpload}
                    onFileRemove={handleFileRemove}
                    cvData={state.cvData}
                    isProcessing={state.cvData?.status === 'processing'}
                    error={state.error}
                    uploadProgress={state.uploadProgress}
                    isUploading={state.isUploading}
                  />

                  {/* Language Selection */}
                  <LanguageSelector
                    currentLanguage={state.language}
                    onLanguageChange={handleLanguageChange}
                  />

                  {/* Job Offer Input */}
                  <JobOfferInput
                    value={state.jobOffer}
                    onChange={handleJobOfferChange}
                    onClear={handleJobOfferClear}
                    error={state.jobOffer.length > 0 && state.jobOffer.length < 100 ? 'Please provide at least 100 characters' : null}
                  />

                  {/* Action Buttons */}
                  <ActionButtons
                    isCVUploaded={!!state.cvData}
                    isJobOfferProvided={state.jobOffer.length >= 100}
                    onGenerateLetter={handleGenerateLetter}
                    onGenerateMail={handleGenerateMail}
                    onAnalyzeCV={handleAnalyzeCV}
                    onStopGeneration={handleStopGeneration}
                    isGenerating={state.isGenerating}
                    generationType={state.generationType}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Two Column Layout when generating content
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Left Column - Input Form (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mt-5">
                <div className="space-y-2">
                  {/* CV Upload */}
                  <CVUpload
                    onFileUpload={handleFileUpload}
                    onFileRemove={handleFileRemove}
                    cvData={state.cvData}
                    isProcessing={state.cvData?.status === 'processing'}
                    error={state.error}
                    uploadProgress={state.uploadProgress}
                    isUploading={state.isUploading}
                  />

                  {/* Language Selection */}
                  <LanguageSelector
                    currentLanguage={state.language}
                    onLanguageChange={handleLanguageChange}
                  />

                  {/* Job Offer Input */}
                  <JobOfferInput
                    value={state.jobOffer}
                    onChange={handleJobOfferChange}
                    onClear={handleJobOfferClear}
                    error={state.jobOffer.length > 0 && state.jobOffer.length < 100 ? 'Please provide at least 100 characters' : null}
                  />

                  {/* Action Buttons */}
                  <ActionButtons
                    isCVUploaded={!!state.cvData}
                    isJobOfferProvided={state.jobOffer.length >= 100}
                    onGenerateLetter={handleGenerateLetter}
                    onGenerateMail={handleGenerateMail}
                    onAnalyzeCV={handleAnalyzeCV}
                    onStopGeneration={handleStopGeneration}
                    isGenerating={state.isGenerating}
                    generationType={state.generationType}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Content Display (2/3 width) */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Content Generator */}
              <div className="bg-white mt-5">
                <ContentGenerator
                  content={state.generatedContent}
                  isGenerating={state.isGenerating}
                  generationType={state.generationType}
                  generationProgress={state.generationProgress}
                  streamingContent={streamingContent}
                  onEdit={handleEdit}
                  onRegenerate={handleRegenerate}
                  onDownload={handleDownload}
                  jobAnalysis={state.jobAnalysis}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
