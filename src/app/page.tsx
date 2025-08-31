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

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        dispatch({ type: 'SET_ERROR', payload: error.error });
        return;
      }

      const result = await response.json();

      // Create CVData object
      const cvData = {
        ...result.cvData,
        uploadDate: new Date(result.cvData.uploadDate),
      };

      dispatch({ type: 'SET_CV_DATA', payload: cvData });
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
            {/* Main Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Job Application Enhancer
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                All tools to create tailored job application kit aligned with your job description
                and your unique skills.
              </p>
            </div>

            {/* Main Content Card */}
            <div className="bg-gray-50 rounded-lg p-6 sm:p-8">
              <div className="space-y-8">
                {/* CV Upload */}
                <CVUpload
                  onFileUpload={handleFileUpload}
                  onFileRemove={handleFileRemove}
                  cvData={state.cvData}
                  isProcessing={state.cvData?.status === 'processing'}
                  error={state.error}
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

                {/* Content Generator */}
                {(state.isGenerating || state.generatedContent) && (
                  <ContentGenerator
                    content={state.generatedContent}
                    isGenerating={state.isGenerating}
                    generationType={state.generationType}
                    streamingContent={streamingContent}
                    onEdit={handleEdit}
                    onRegenerate={handleRegenerate}
                    onDownload={handleDownload}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
