import { NextRequest, NextResponse } from 'next/server';
import { CVAnalysisResult, CVAnalysis, ExtractedSkill, ExperienceAnalysis, EducationAnalysis, SkillMatch } from '../../../lib/types';
import { openai } from '../../../lib/openai';

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
Analyze the following CV data and job offer to provide a comprehensive analysis. Return a JSON response with the following structure:

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
        "skills": ["skill1", "skill2"],
        "achievements": ["achievement1", "achievement2"],
        "relevanceScore": 0.0-1.0
      }
    ],
    "education": [
      {
        "degree": "degree_name",
        "institution": "institution_name",
        "year": "year",
        "relevance": "high|medium|low",
        "skills": ["skill1", "skill2"]
      }
    ],
    "strengths": ["strength1", "strength2"],
    "weaknesses": ["weakness1", "weakness2"],
    "recommendations": ["recommendation1", "recommendation2"],
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
    "missingSkills": ["skill1", "skill2"],
    "strengths": ["strength1", "strength2"],
    "recommendations": ["recommendation1", "recommendation2"]
  }
}

CV Data:
- Filename: ${cvData.filename}
- Experience: ${JSON.stringify(cvData.experience)}
- Education: ${JSON.stringify(cvData.education)}
- Processed Content: ${cvData.processedContent}

Job Offer:
${jobOffer}

Language: ${language?.name || 'English'}

Please provide a detailed analysis focusing on:
1. Skill extraction and categorization
2. Experience relevance scoring
3. Education assessment
4. Strengths and weaknesses identification
5. Job match analysis with specific skill gaps
6. Actionable recommendations for improvement

Return only valid JSON without any additional text or formatting.
`;

    const openaiResponse = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-oss',
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV analyst and career advisor. Analyze CVs and job offers to provide detailed insights, skill assessments, and career recommendations. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000,
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
      cvAnalysisResult = JSON.parse(aiResponse);
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
    cvAnalysisResult.analysis.metadata.processingTime = processingTime;
    cvAnalysisResult.analysis.analysisDate = new Date(cvAnalysisResult.analysis.analysisDate);

    // Validate the response structure
    console.log('Validating response structure:', {
      hasAnalysis: !!cvAnalysisResult.analysis,
      hasJobMatch: !!cvAnalysisResult.jobMatch,
      analysisKeys: cvAnalysisResult.analysis ? Object.keys(cvAnalysisResult.analysis) : [],
      jobMatchKeys: cvAnalysisResult.jobMatch ? Object.keys(cvAnalysisResult.jobMatch) : []
    });

    if (!cvAnalysisResult.analysis || !cvAnalysisResult.jobMatch) {
      console.error('Invalid analysis structure:', cvAnalysisResult);
      return NextResponse.json(
        { error: 'Invalid analysis structure from AI service' },
        { status: 500 }
      );
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
