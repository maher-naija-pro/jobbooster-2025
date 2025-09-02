// Simple test script to verify CV analysis functionality
const fs = require('fs');
const path = require('path');

// Test data - sample CV content
const sampleCVContent = `
John Doe
Software Engineer
john.doe@email.com | +1 (555) 123-4567 | San Francisco, CA
LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years of experience in full-stack development, 
specializing in React, Node.js, and cloud technologies. Passionate about building 
scalable applications and leading development teams.

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java
Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS
Backend: Node.js, Express.js, Python, Django
Database: PostgreSQL, MongoDB, Redis
Cloud: AWS, Docker, Kubernetes
Tools: Git, Jenkins, Jira, VS Code

WORK EXPERIENCE

Senior Software Engineer | TechCorp Inc. | 2022 - Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews
• Technologies: React, Node.js, AWS, Docker

Software Engineer | StartupXYZ | 2020 - 2022
• Developed responsive web applications using React and Node.js
• Collaborated with cross-functional teams in agile environment
• Optimized database queries improving performance by 40%
• Technologies: JavaScript, PostgreSQL, AWS

EDUCATION
Bachelor of Science in Computer Science
University of California, Berkeley | 2020
GPA: 3.8/4.0

PROJECTS
E-commerce Platform
• Built full-stack e-commerce application with React and Node.js
• Implemented payment processing with Stripe API
• Deployed on AWS with auto-scaling capabilities
• GitHub: github.com/johndoe/ecommerce

Task Management App
• Developed collaborative task management tool
• Real-time updates using WebSocket connections
• Mobile-responsive design with PWA features
• Technologies: Vue.js, Express.js, MongoDB

CERTIFICATIONS
AWS Certified Solutions Architect
Google Cloud Professional Developer
Certified Scrum Master (CSM)
`;

// Test the API endpoint
async function testCVAnalysis() {
    try {
        console.log('Testing CV Analysis API...');

        const response = await fetch('http://localhost:3000/api/extract-cv-content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                cvContent: sampleCVContent,
                filename: 'test-cv.pdf',
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ CV Analysis successful!');
        console.log('📊 Analysis Results:');
        console.log(JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error('❌ CV Analysis failed:', error.message);
        return null;
    }
}

// Test PDF upload
async function testPDFUpload() {
    try {
        console.log('Testing PDF Upload API...');

        // Create a simple text file to simulate PDF upload
        const formData = new FormData();
        const blob = new Blob([sampleCVContent], { type: 'text/plain' });
        formData.append('file', blob, 'test-cv.pdf');

        const response = await fetch('http://localhost:3000/api/upload-cv', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('✅ PDF Upload successful!');
        console.log('📄 Upload Results:');
        console.log(JSON.stringify(result, null, 2));

        return result;
    } catch (error) {
        console.error('❌ PDF Upload failed:', error.message);
        return null;
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting CV Analysis Tests...\n');

    // Test 1: PDF Upload
    console.log('Test 1: PDF Upload');
    console.log('==================');
    const uploadResult = await testPDFUpload();
    console.log('\n');

    // Test 2: CV Analysis
    console.log('Test 2: CV Content Analysis');
    console.log('============================');
    const analysisResult = await testCVAnalysis();
    console.log('\n');

    // Summary
    console.log('📋 Test Summary:');
    console.log('================');
    console.log(`PDF Upload: ${uploadResult ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`CV Analysis: ${analysisResult ? '✅ PASSED' : '❌ FAILED'}`);

    if (uploadResult && analysisResult) {
        console.log('\n🎉 All tests passed! CV analysis system is working correctly.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the server and try again.');
    }
}

// Check if running in Node.js environment
if (typeof window === 'undefined') {
    // Node.js environment - use node-fetch
    const fetch = require('node-fetch');
    runTests();
} else {
    // Browser environment
    console.log('Run this script in Node.js environment or open the browser console and call runTests()');
    window.runTests = runTests;
}
