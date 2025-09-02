'use client';

import React, { useState } from 'react';
import { CVData, PersonalInfo, SkillsData, Project } from '../lib/types';

interface CVContentAnalyzerProps {
    cvData: CVData;
    onAnalyze?: (analysis: any) => void;
}

export default function CVContentAnalyzer({ cvData, onAnalyze }: CVContentAnalyzerProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);

    const handleAnalyzeContent = async () => {
        if (!cvData.processedContent) {
            alert('No CV content available for analysis');
            return;
        }

        setIsAnalyzing(true);
        try {
            const response = await fetch('/api/extract-cv-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cvContent: cvData.processedContent,
                    filename: cvData.filename,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze CV content');
            }

            const result = await response.json();
            setAnalysisResult(result);
            onAnalyze?.(result);
        } catch (error) {
            console.error('Error analyzing CV content:', error);
            alert('Failed to analyze CV content');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const renderPersonalInfo = (info: PersonalInfo) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {info.name && (
                    <div>
                        <span className="font-medium text-gray-600">Name:</span>
                        <p className="text-gray-800">{info.name}</p>
                    </div>
                )}
                {info.email && (
                    <div>
                        <span className="font-medium text-gray-600">Email:</span>
                        <p className="text-gray-800">{info.email}</p>
                    </div>
                )}
                {info.phone && (
                    <div>
                        <span className="font-medium text-gray-600">Phone:</span>
                        <p className="text-gray-800">{info.phone}</p>
                    </div>
                )}
                {info.location && (
                    <div>
                        <span className="font-medium text-gray-600">Location:</span>
                        <p className="text-gray-800">{info.location}</p>
                    </div>
                )}
                {info.linkedin && (
                    <div>
                        <span className="font-medium text-gray-600">LinkedIn:</span>
                        <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {info.linkedin}
                        </a>
                    </div>
                )}
                {info.website && (
                    <div>
                        <span className="font-medium text-gray-600">Website:</span>
                        <a href={info.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {info.website}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSkills = (skills: SkillsData) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Skills</h3>
            <div className="space-y-4">
                {skills.technical && skills.technical.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Technical Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.technical.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {skills.soft && skills.soft.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Soft Skills</h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.soft.map((skill, index) => (
                                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {skills.languages && skills.languages.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Languages</h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.languages.map((language, index) => (
                                <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                                    {language}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
                {skills.certifications && skills.certifications.length > 0 && (
                    <div>
                        <h4 className="font-medium text-gray-700 mb-2">Certifications</h4>
                        <div className="flex flex-wrap gap-2">
                            {skills.certifications.map((cert, index) => (
                                <span key={index} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderProjects = (projects: Project[]) => (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Projects</h3>
            <div className="space-y-4">
                {projects.map((project, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-medium text-gray-800">{project.name}</h4>
                        <p className="text-gray-600 mt-1">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                            <div className="mt-2">
                                <span className="text-sm text-gray-500">Technologies: </span>
                                <span className="text-sm text-gray-700">{project.technologies.join(', ')}</span>
                            </div>
                        )}
                        {project.url && (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-1 block">
                                View Project
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* CV Content Preview */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">CV Content Analysis</h2>
                    <button
                        onClick={handleAnalyzeContent}
                        disabled={isAnalyzing}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                    </button>
                </div>

                <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">File Information</h3>
                    <p className="text-sm text-gray-600">
                        <strong>Filename:</strong> {cvData.filename} |
                        <strong> Size:</strong> {(cvData.size / 1024).toFixed(1)} KB |
                        <strong> Uploaded:</strong> {new Date(cvData.uploadDate).toLocaleDateString()}
                    </p>
                </div>

                <div className="mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Extracted Content Preview</h3>
                    <div className="bg-gray-50 p-4 rounded-lg max-h-60 overflow-y-auto">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                            {cvData.processedContent.substring(0, 1000)}
                            {cvData.processedContent.length > 1000 && '...'}
                        </pre>
                    </div>
                </div>
            </div>

            {/* Analysis Results */}
            {analysisResult && (
                <div className="space-y-6">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Analysis Complete</h3>
                        <p className="text-green-700">CV content has been successfully analyzed and structured.</p>
                    </div>

                    {/* Personal Information */}
                    {analysisResult.extractedData?.personalInfo && renderPersonalInfo(analysisResult.extractedData.personalInfo)}

                    {/* Summary */}
                    {analysisResult.extractedData?.summary && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Professional Summary</h3>
                            <p className="text-gray-700">{analysisResult.extractedData.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {analysisResult.extractedData?.skills && renderSkills(analysisResult.extractedData.skills)}

                    {/* Experience */}
                    {analysisResult.cvData?.experience && analysisResult.cvData.experience.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Work Experience</h3>
                            <div className="space-y-4">
                                {analysisResult.cvData.experience.map((exp: any, index: number) => (
                                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-medium text-gray-800">{exp.title}</h4>
                                        <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                                        <p className="text-gray-700 mt-2">{exp.description}</p>
                                        {exp.achievements && exp.achievements.length > 0 && (
                                            <div className="mt-2">
                                                <h5 className="font-medium text-gray-700">Key Achievements:</h5>
                                                <ul className="list-disc list-inside text-gray-600 mt-1">
                                                    {exp.achievements.map((achievement: string, i: number) => (
                                                        <li key={i}>{achievement}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {analysisResult.cvData?.education && analysisResult.cvData.education.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Education</h3>
                            <div className="space-y-3">
                                {analysisResult.cvData.education.map((edu: any, index: number) => (
                                    <div key={index} className="border-l-4 border-green-500 pl-4">
                                        <h4 className="font-medium text-gray-800">{edu.degree}</h4>
                                        <p className="text-gray-600">{edu.institution} • {edu.year}</p>
                                        {edu.field && <p className="text-gray-700">{edu.field}</p>}
                                        {edu.gpa && <p className="text-gray-700">GPA: {edu.gpa}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {analysisResult.extractedData?.projects && analysisResult.extractedData.projects.length > 0 &&
                        renderProjects(analysisResult.extractedData.projects)}
                </div>
            )}
        </div>
    );
}
