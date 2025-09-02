# CV Analysis System

## Overview

The CV Analysis System provides comprehensive analysis of CV/resume content from PDF and DOC files. It extracts structured information, analyzes skills, and provides detailed insights for job matching and career development.

## Features

### 🔍 **PDF Content Extraction**
- **PDF Parsing**: Extracts text content from PDF files using `pdf-parse`
- **DOC/DOCX Support**: Handles Microsoft Word documents using `mammoth`
- **File Validation**: Validates file types and sizes (max 10MB)
- **Error Handling**: Robust error handling for corrupted or unsupported files

### 🤖 **AI-Powered Analysis**
- **Content Structuring**: Uses OpenAI GPT-4o to extract structured data
- **Skill Extraction**: Identifies technical, soft, and language skills
- **Experience Analysis**: Parses work experience with achievements
- **Education Parsing**: Extracts educational background and certifications
- **Project Recognition**: Identifies and structures project information

### 📊 **Structured Data Output**
- **Personal Information**: Name, contact details, location, social profiles
- **Professional Summary**: Extracted objective or summary
- **Work Experience**: Detailed job history with achievements
- **Education**: Academic background and certifications
- **Skills**: Categorized technical and soft skills
- **Projects**: Portfolio projects with technologies used

## API Endpoints

### 1. Upload CV (`POST /api/upload-cv`)

Uploads and extracts content from CV files.

**Request:**
```javascript
const formData = new FormData();
formData.append('file', file); // PDF, DOC, or DOCX file

fetch('/api/upload-cv', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "cvData": {
    "id": "cv_1234567890",
    "filename": "resume.pdf",
    "size": 245760,
    "uploadDate": "2024-01-15T10:30:00.000Z",
    "processedContent": "Extracted text content...",
    "status": "completed"
  },
  "processingTime": 1500
}
```

### 2. Extract CV Content (`POST /api/extract-cv-content`)

Analyzes extracted CV content and structures it using AI.

**Request:**
```javascript
fetch('/api/extract-cv-content', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cvContent: "CV text content...",
    filename: "resume.pdf"
  })
});
```

**Response:**
```json
{
  "success": true,
  "cvData": {
    "id": "cv_1234567890",
    "filename": "resume.pdf",
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567",
      "location": "San Francisco, CA",
      "linkedin": "linkedin.com/in/johndoe"
    },
    "summary": "Experienced software engineer...",
    "experience": [
      {
        "title": "Senior Software Engineer",
        "company": "TechCorp Inc.",
        "duration": "2022 - Present",
        "description": "Led development of microservices...",
        "achievements": ["Led team of 5 developers", "Improved performance by 40%"],
        "skills": ["React", "Node.js", "AWS"]
      }
    ],
    "education": [
      {
        "degree": "Bachelor of Science in Computer Science",
        "institution": "University of California, Berkeley",
        "year": "2020",
        "field": "Computer Science",
        "gpa": "3.8/4.0"
      }
    ],
    "skills": {
      "technical": ["JavaScript", "React", "Node.js", "AWS"],
      "soft": ["Leadership", "Communication", "Problem Solving"],
      "languages": ["English", "Spanish"],
      "certifications": ["AWS Certified Solutions Architect"]
    },
    "projects": [
      {
        "name": "E-commerce Platform",
        "description": "Built full-stack e-commerce application...",
        "technologies": ["React", "Node.js", "PostgreSQL"],
        "url": "https://github.com/johndoe/ecommerce"
      }
    ]
  },
  "extractedData": { /* Raw AI extraction results */ }
}
```

## Components

### CVContentAnalyzer

React component for displaying and analyzing CV content.

**Props:**
- `cvData`: CVData object with extracted content
- `onAnalyze`: Callback function when analysis is complete

**Features:**
- Content preview with extracted text
- Analysis button to trigger AI processing
- Structured display of personal info, skills, experience
- Responsive design with modern UI

## Usage Example

```typescript
import CVContentAnalyzer from '@/components/CVContentAnalyzer';
import { CVData } from '@/lib/types';

function MyComponent() {
  const [cvData, setCvData] = useState<CVData | null>(null);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload-cv', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    if (result.success) {
      setCvData(result.cvData);
    }
  };

  return (
    <div>
      {cvData && (
        <CVContentAnalyzer 
          cvData={cvData} 
          onAnalyze={(analysis) => console.log('Analysis complete:', analysis)}
        />
      )}
    </div>
  );
}
```

## Dependencies

### Required Packages
- `pdf-parse`: PDF text extraction
- `mammoth`: DOC/DOCX text extraction
- `@types/pdf-parse`: TypeScript definitions
- `openai`: AI-powered content analysis

### Installation
```bash
npm install pdf-parse mammoth
npm install --save-dev @types/pdf-parse
```

## Environment Variables

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o  # Optional, defaults to gpt-4o
```

## Error Handling

The system handles various error scenarios:

- **File Type Validation**: Only PDF, DOC, DOCX files allowed
- **File Size Limits**: Maximum 10MB file size
- **Content Extraction Errors**: Graceful handling of corrupted files
- **AI Service Errors**: Fallback responses for API failures
- **Parsing Errors**: JSON parsing error handling

## Testing

Use the provided test script to verify functionality:

```bash
node test-cv-analysis.js
```

The test script includes:
- PDF upload simulation
- CV content analysis
- Response validation
- Error handling verification

## Performance Considerations

- **File Size**: Large files may take longer to process
- **AI Processing**: Analysis time depends on content complexity
- **Memory Usage**: PDF parsing loads entire file into memory
- **Rate Limiting**: Consider OpenAI API rate limits for production

## Security

- **File Validation**: Strict file type and size validation
- **Content Sanitization**: AI processes text content safely
- **No File Storage**: Files are processed in memory only
- **API Security**: Standard Next.js API route security

## Future Enhancements

- **Batch Processing**: Multiple file upload support
- **Advanced Parsing**: Better handling of complex CV layouts
- **Skill Matching**: Integration with job requirement matching
- **Export Options**: PDF/DOCX export of analyzed data
- **Caching**: Redis caching for improved performance
- **Analytics**: Usage tracking and performance metrics
