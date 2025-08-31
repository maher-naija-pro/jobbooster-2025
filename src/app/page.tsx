'use client';

import { CVUpload } from '../components/CVUpload';
import { LanguageSelection } from '../components/LanguageSelection';
import { JobOfferInput } from '../components/JobOfferInput';
import { ActionButtons } from '../components/ActionButtons';
import { useApp } from '../lib/context';

export default function Home() {
  const { state } = useApp();

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

            {/* Components Container */}
            <div className="space-y-6">
              {/* CV Upload Section */}
              <CVUpload
                cvData={state.cvData}
                uploadState={state.cvUploadState}
                uploadProgress={state.cvUploadProgress}
                uploadError={state.cvUploadError}
              />

              {/* Language Selection */}
              <LanguageSelection
                currentLanguage={state.selectedLanguage}
              />

              {/* Job Offer Input */}
              <JobOfferInput
                jobContent={state.jobContent}
                jobAnalysis={state.jobAnalysis}
                jobAnalysisState={state.jobAnalysisState}
                jobAnalysisError={state.jobAnalysisError}
              />

              {/* Action Buttons */}
              <ActionButtons
                isCVUploaded={!!state.cvData}
                isJobOfferProvided={state.jobContent.trim().length > 0}
                generationState={state.generationState}
                generationType={state.generationType}
                generationProgress={state.generationProgress}
                generationError={state.generationError}
                generatedContent={state.generatedContent}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
