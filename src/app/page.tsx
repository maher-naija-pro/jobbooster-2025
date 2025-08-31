'use client';

import { useApp } from '../lib/app-context';
import { CVUpload } from '../components/cv-upload';
import { LanguageSelector } from '../components/language-selector';
import { JobOfferInput } from '../components/job-offer-input';
import { ActionButtons } from '../components/action-buttons';
import { ContentGenerator } from '../components/content-generator';
import { Language } from '../lib/types';
import { useState } from 'react';

export default function Home() {
  const { state, dispatch } = useApp();
  const [streamingContent, setStreamingContent] = useState('');

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

    try {
      const endpoint = type === 'cover-letter' ? '/api/generate-letter' : '/api/generate-email';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cvData: state.cvData,
          jobAnalysis: state.jobAnalysis || {
            experienceLevel: 'mid',
            industry: 'Technology',
            requirements: ['Problem solving', 'Communication'],
            companySize: 'Medium',
            location: 'Remote',
            keywords: ['development', 'teamwork']
          },
          language: state.language,
          type: type === 'email' ? 'application' : undefined,
        }),
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
      }
    } catch (error) {
      console.error('Generation failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to generate content. Please try again.' });
    }
  };

  const handleGenerateLetter = () => {
    handleStreamingGeneration('cover-letter');
  };

  const handleGenerateMail = () => {
    handleStreamingGeneration('email');
  };

  const handleEdit = () => {
    // TODO: Implement edit functionality
    console.log('Edit content');
  };

  const handleRegenerate = () => {
    if (state.generationType) {
      handleStreamingGeneration(state.generationType);
    }
  };

  const handleDownload = (format: 'pdf' | 'docx' | 'txt') => {
    // TODO: Implement actual download functionality
    console.log('Download as', format);
  };

  const handleStopGeneration = () => {
    if (state.isGenerating) {
      // Stop the current generation process
      dispatch({ type: 'STOP_GENERATION' });
      setStreamingContent('');
      // Note: In a real implementation, you would also need to abort the fetch request
      console.log('Generation stopped by user');
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Main Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Job Application Enhancer
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                All tools to create tailored job application kit aligned with your job description
                and your unique skills.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Input Form */}
              <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
                <div className="space-y-8">
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
                    onStopGeneration={handleStopGeneration}
                    isGenerating={state.isGenerating}
                    generationType={state.generationType}
                  />
                </div>
              </div>

              {/* Right Column - Content Display */}
              <div className="bg-white">
                {(state.isGenerating || state.generatedContent) ? (
                  <ContentGenerator
                    content={state.generatedContent}
                    isGenerating={state.isGenerating}
                    generationType={state.generationType}
                    streamingContent={streamingContent}
                    onEdit={handleEdit}
                    onRegenerate={handleRegenerate}
                    onDownload={handleDownload}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="text-sm">Generated content will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
