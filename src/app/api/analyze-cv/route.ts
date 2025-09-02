import { NextRequest, NextResponse } from 'next/server';
import { CVAnalysisResult, CVAnalysis, ExtractedSkill, ExperienceAnalysis, EducationAnalysis, SkillMatch } from '../../../lib/types';
import { openai } from '../../../lib/openai';

// Helper function to transform AI response variations to expected structure
function transformAIResponse(aiResponse: any): CVAnalysisResult | null {
  try {
    // If the response already has the correct structure, return it
    if (aiResponse.analysis && aiResponse.jobMatch) {
      return aiResponse;
    }

    // Handle case where AI returns alternative field names
    let analysis = aiResponse.analysis;
    let jobMatch = aiResponse.jobMatch;

    // If analysis is missing, try to construct it from other fields
    if (!analysis && aiResponse['job match analysis']) {
      const jobMatchAnalysis = aiResponse['job match analysis'];
      analysis = {
        id: aiResponse.id || `analysis_${Date.now()}`,
        cvId: aiResponse.cvId || '',
        analysisDate: aiResponse.analysisDate || new Date().toISOString(),
        status: 'completed',
        skills: aiResponse.skills || [],
        experience: aiResponse.experience || [],
        education: aiResponse.education || [],
        strengths: jobMatchAnalysis.strengths || [],
        weaknesses: jobMatchAnalysis.weaknesses || [],
        recommendations: aiResponse['actionable recommendations'] || [],
        overallScore: jobMatchAnalysis.overallMatch || 0,
        metadata: aiResponse.metadata || {
          processingTime: 0,
          confidence: 0.8,
          version: '1.0.0'
        }
      };
    }

    // If jobMatch is missing, try to construct it from other fields
    if (!jobMatch) {
      const experienceRelevance = aiResponse['experience relevance scoring'] || {};
      const jobMatchAnalysis = aiResponse['job match analysis'] || {};
      const actionableRecommendations = aiResponse['actionable recommendations'] || [];

      jobMatch = {
        overallMatch: jobMatchAnalysis.overallMatch || 0,
        skillMatches: Object.entries(experienceRelevance).map(([skill, score]) => ({
          skill,
          cvLevel: 'intermediate' as const,
          jobRequirement: 'preferred' as const,
          matchScore: typeof score === 'number' ? score : 0.5,
          gap: typeof score === 'number' && score < 0.5 ? 'moderate' as const : 'none' as const,
          recommendation: `Improve ${skill} skills` as const
        })),
        missingSkills: jobMatchAnalysis['skill gaps']?.map((gap: any) => gap.skill) || [],
        strengths: jobMatchAnalysis.strengths || [],
        recommendations: actionableRecommendations.map((rec: any) => rec.recommendation || rec)
      };
    }

    if (analysis && jobMatch) {
      return { analysis, jobMatch };
    }

    return null;
  } catch (error) {
    console.error('Error transforming AI response:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cvData, jobOffer, language } = body;

    if (!cvData || !jobOffer) {
      return NextResponse.json(
        { error: 'CV data and job offer are required' },
        { status: 400 }
      );
    }

    // Call OpenAI API for CV analysis

    const startTime = Date.now();

    // Prepare the prompt for CV analysis
    const analysisPrompt = `
Analyze the following CV data and job offer to provide a comprehensive analysis. Return a JSON response with the following EXACT structure:

{
  "analysis": {
    "id": "analysis_${Date.now()}",
    "cvId": "${cvData.id}",
    "analysisDate": "${new Date().toISOString()}",
    "status": "completed",
    "skills": [
      {
        "name": "skill_name",
        "category": "technical|soft|language|certification|tool",
        "level": "beginner|intermediate|advanced|expert",
        "confidence": 0.0-1.0,
        "context": ["context1", "context2"],
        "yearsOfExperience": number
      }
    ],
    "experience": [
      {
        "title": "job_title",
        "company": "company_name",
        "duration": "duration",
        "description": "description",
        "skills": ["skill1", "skill2", "skill3", "skill4"],
        "achievements": ["achievement1", "achievement2", "achievement3"],
        "relevanceScore": 0.0-1.0
      }
    ],
    "education": [
      {
        "degree": "degree_name",
        "institution": "institution_name",
        "year": "year",
        "relevance": "high|medium|low",
        "skills": ["skill1", "skill2", "skill3"]
      }
    ],
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
    "overallScore": 0-100,
    "metadata": {
      "processingTime": number,
      "confidence": 0.0-1.0,
      "version": "1.0.0"
    }
  },
  "jobMatch": {
    "overallMatch": 0-100,
    "skillMatches": [
      {
        "skill": "skill_name",
        "cvLevel": "beginner|intermediate|advanced|expert",
        "jobRequirement": "required|preferred|optional",
        "matchScore": 0.0-1.0,
        "gap": "none|minor|moderate|major",
        "recommendation": "recommendation_text"
      }
    ],
    "missingSkills": ["skill1", "skill2", "skill3"],
    "strengths": ["strength1", "strength2"],
    "recommendations": ["recommendation1", "recommendation2"]
  }
}

CRITICAL: You MUST return ONLY this exact structure. Do NOT add any additional fields like "experience relevance scoring", "job match analysis", or "actionable recommendations". The response must have exactly two top-level fields: "analysis" and "jobMatch".

CV Data:
- Filename: ${cvData.filename}
- Experience: ${JSON.stringify(cvData.experience)}
- Education: ${JSON.stringify(cvData.education)}
- Processed Content: ${cvData.processedContent}

Job Offer:
${jobOffer}

Language: ${language?.name || 'English'}

CRITICAL INSTRUCTIONS FOR SKILL AND EXPERIENCE FILTERING:
1. Extract ALL skills mentioned in the CV content first, then select the TOP 10 MOST RELEVANT skills for this specific job offer
2. For experiences, select the TOP 4 MOST RELEVANT experiences based on job requirements and relevance
3. Relevance should be determined by:
   - Direct skill matches with job requirements
   - Industry/domain relevance
   - Seniority level alignment
   - Recent experience (prefer more recent roles)
   - Achievement impact and scope
4. For skills: prioritize technical skills that match job requirements, then soft skills, then certifications
5. For experiences: prioritize roles that demonstrate required skills and show career progression
6. Include both technical skills (programming languages, frameworks, tools) and soft skills (communication, leadership, etc.)
7. For each skill, determine the appropriate category, level, and confidence score
8. Skills can be mentioned explicitly or inferred from job descriptions and achievements

Please provide a detailed analysis focusing on:
1. TOP 10 MOST RELEVANT skills for this specific job offer (not all skills)
2. TOP 4 MOST RELEVANT experiences based on job requirements
3. Education assessment
4. Strengths and weaknesses identification
5. Job match analysis with specific skill gaps
6. Actionable recommendations for improvement

IMPORTANT: Return ONLY valid JSON. Do not include any explanatory text, comments, or formatting. Start your response directly with { and end with }. The response must be parseable JSON.
`;

    const openaiResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-oss',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV analyst. Your primary task is to analyze CVs against specific job offers and provide the MOST RELEVANT skills and experiences. CRITICAL REQUIREMENTS: 1) Return EXACTLY 10 most relevant skills for the job offer (prioritize technical skills that match job requirements, then soft skills, then certifications). 2) Return EXACTLY 4 most relevant work experiences based on job requirements, industry relevance, and career progression. 3) Focus on relevance to the specific job offer, not just comprehensive extraction. 4) You must respond with ONLY valid JSON. Do not include any explanatory text, comments, or formatting outside the JSON structure. Start your response directly with the opening brace { and end with the closing brace }.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 6000,
    });

    const aiResponse = openaiResponse.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: 'No response from AI service' },
        { status: 500 }
      );
    }

    // Parse the AI response
    let cvAnalysisResult: CVAnalysisResult;
    try {
      console.log('Raw AI Response:', aiResponse);

      // Extract JSON from the response (handle cases where AI adds explanatory text)
      let jsonString = aiResponse.trim();

      // If the response contains explanatory text before JSON, extract just the JSON part
      const jsonStartIndex = jsonString.indexOf('{');
      if (jsonStartIndex > 0) {
        jsonString = jsonString.substring(jsonStartIndex);
      }

      // Find the last closing brace to handle cases where there might be text after JSON
      const lastBraceIndex = jsonString.lastIndexOf('}');
      if (lastBraceIndex !== -1 && lastBraceIndex < jsonString.length - 1) {
        jsonString = jsonString.substring(0, lastBraceIndex + 1);
      }

      console.log('Extracted JSON string:', jsonString);
      cvAnalysisResult = JSON.parse(jsonString);
      console.log('Parsed CV Analysis Result:', cvAnalysisResult);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('AI Response:', aiResponse);
      return NextResponse.json(
        { error: 'Invalid response format from AI service' },
        { status: 500 }
      );
    }

    // Update processing time
    const processingTime = Date.now() - startTime;

    // Initialize metadata if it doesn't exist
    if (!cvAnalysisResult.analysis.metadata) {
      cvAnalysisResult.analysis.metadata = {
        processingTime: 0,
        confidence: 0.8,
        version: "1.0.0"
      };
    }

    cvAnalysisResult.analysis.metadata.processingTime = processingTime;
    cvAnalysisResult.analysis.analysisDate = new Date(cvAnalysisResult.analysis.analysisDate);

    // Apply filtering to limit skills to 10 and experiences to 4 most relevant
    if (cvAnalysisResult.analysis.skills && cvAnalysisResult.analysis.skills.length > 10) {
      // Sort skills by relevance (confidence + category priority) and take top 10
      cvAnalysisResult.analysis.skills = cvAnalysisResult.analysis.skills
        .sort((a, b) => {
          // Priority: technical > soft > language > certification > tool
          const categoryPriority = { technical: 5, soft: 4, language: 3, certification: 2, tool: 1 };
          const aPriority = categoryPriority[a.category] || 0;
          const bPriority = categoryPriority[b.category] || 0;

          // If same category, sort by confidence
          if (aPriority === bPriority) {
            return b.confidence - a.confidence;
          }
          return bPriority - aPriority;
        })
        .slice(0, 10);
    }

    if (cvAnalysisResult.analysis.experience && cvAnalysisResult.analysis.experience.length > 4) {
      // Sort experiences by relevance score and take top 4
      cvAnalysisResult.analysis.experience = cvAnalysisResult.analysis.experience
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, 4);
    }

    // Validate and transform the response structure
    console.log('Validating response structure:', {
      hasAnalysis: !!cvAnalysisResult.analysis,
      hasJobMatch: !!cvAnalysisResult.jobMatch,
      analysisKeys: cvAnalysisResult.analysis ? Object.keys(cvAnalysisResult.analysis) : [],
      jobMatchKeys: cvAnalysisResult.jobMatch ? Object.keys(cvAnalysisResult.jobMatch) : [],
      allKeys: Object.keys(cvAnalysisResult)
    });

    // Handle AI response variations by transforming the structure
    if (!cvAnalysisResult.analysis || !cvAnalysisResult.jobMatch) {
      console.log('Attempting to transform AI response structure...');

      // Check if AI returned alternative field names
      const transformedResult = transformAIResponse(cvAnalysisResult);

      if (transformedResult && transformedResult.analysis && transformedResult.jobMatch) {
        console.log('Successfully transformed AI response');
        cvAnalysisResult = transformedResult;
      } else {
        console.error('Invalid analysis structure:', cvAnalysisResult);
        return NextResponse.json(
          { error: 'Invalid analysis structure from AI service. Expected fields: analysis, jobMatch' },
          { status: 500 }
        );
      }
    }

    const finalResponse = {
      success: true,
      result: cvAnalysisResult,
      processingTime
    };

    console.log('Final API response:', finalResponse);
    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error('Error analyzing CV:', error);
    return NextResponse.json(
      { error: 'Failed to analyze CV' },
      { status: 500 }
    );
  }
}
