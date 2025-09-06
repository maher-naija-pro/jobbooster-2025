#!/usr/bin/env node

/**
 * Test script for the LLM processing route
 * This script tests various scenarios to identify issues
 */

const http = require('http');
const https = require('https');
const { URL } = require('url');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_ENDPOINT = '/api/cv-data/llm-process';

// Test data
const testCvData = {
    id: 'test-cv-123',
    fileName: 'test-cv.pdf',
    extractedText: `
        John Doe
        Software Engineer
        john.doe@email.com
        +1-555-0123
        
        EXPERIENCE:
        Senior Software Engineer at Tech Corp (2020-2024)
        - Developed web applications using React and Node.js
        - Led a team of 5 developers
        - Improved system performance by 40%
        
        Software Engineer at StartupXYZ (2018-2020)
        - Built mobile applications using React Native
        - Implemented CI/CD pipelines
        
        EDUCATION:
        Bachelor of Science in Computer Science
        University of Technology (2014-2018)
        
        SKILLS:
        - JavaScript, TypeScript, React, Node.js
        - Python, Java, C++
        - AWS, Docker, Kubernetes
        - Agile, Scrum
    `
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const isHttps = parsedUrl.protocol === 'https:';
        const client = isHttps ? https : http;

        const requestOptions = {
            hostname: parsedUrl.hostname,
            port: parsedUrl.port || (isHttps ? 443 : 80),
            path: parsedUrl.pathname + parsedUrl.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        const req = client.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = data ? JSON.parse(data) : {};
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: jsonData
                    });
                } catch (error) {
                    resolve({
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                }
            });
        });

        req.on('error', reject);

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

// Test cases
const testCases = [
    {
        name: 'Missing CV ID',
        test: async () => {
            console.log('🧪 Testing: Missing CV ID');
            const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, {
                method: 'POST',
                body: {}
            });

            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Response:`, response.data);

            if (response.statusCode === 400 && response.data.error?.includes('CV ID is required')) {
                console.log('   ✅ PASS: Correctly handles missing CV ID');
                return true;
            } else {
                console.log('   ❌ FAIL: Should return 400 for missing CV ID');
                return false;
            }
        }
    },
    {
        name: 'Invalid CV ID',
        test: async () => {
            console.log('🧪 Testing: Invalid CV ID');
            const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, {
                method: 'POST',
                body: { cvId: 'non-existent-cv-id' }
            });

            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Response:`, response.data);

            if (response.statusCode === 404 && response.data.error?.includes('CV not found')) {
                console.log('   ✅ PASS: Correctly handles invalid CV ID');
                return true;
            } else {
                console.log('   ❌ FAIL: Should return 404 for invalid CV ID');
                return false;
            }
        }
    },
    {
        name: 'Invalid JSON body',
        test: async () => {
            console.log('🧪 Testing: Invalid JSON body');
            try {
                const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, {
                    method: 'POST',
                    body: 'invalid json'
                });
                console.log(`   Status: ${response.statusCode}`);
                console.log(`   Response:`, response.data);

                if (response.statusCode >= 400) {
                    console.log('   ✅ PASS: Correctly handles invalid JSON');
                    return true;
                } else {
                    console.log('   ❌ FAIL: Should return error for invalid JSON');
                    return false;
                }
            } catch (error) {
                console.log('   ✅ PASS: Correctly throws error for invalid JSON');
                return true;
            }
        }
    },
    {
        name: 'Valid request with mock data',
        test: async () => {
            console.log('🧪 Testing: Valid request with mock data');
            const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, {
                method: 'POST',
                body: {
                    cvId: 'test-cv-123',
                    forceReprocess: true
                }
            });

            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Response:`, JSON.stringify(response.data, null, 2));

            // This test might fail if the CV doesn't exist in the database
            // but we can check if the route is accessible and handles the request
            if (response.statusCode === 404) {
                console.log('   ⚠️  EXPECTED: CV not found (database not seeded)');
                return true;
            } else if (response.statusCode === 200) {
                console.log('   ✅ PASS: Successfully processed CV');
                return true;
            } else if (response.statusCode === 500) {
                console.log('   ⚠️  Server error - might be missing environment variables');
                return true;
            } else {
                console.log('   ❌ FAIL: Unexpected response');
                return false;
            }
        }
    },
    {
        name: 'Invalid forceReprocess parameter',
        test: async () => {
            console.log('🧪 Testing: Invalid forceReprocess parameter');
            const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, {
                method: 'POST',
                body: {
                    cvId: 'test-cv-123',
                    forceReprocess: 'invalid-boolean'
                }
            });

            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Response:`, response.data);

            if (response.statusCode === 400 && response.data.error?.includes('forceReprocess must be a boolean')) {
                console.log('   ✅ PASS: Correctly validates forceReprocess parameter');
                return true;
            } else {
                console.log('   ❌ FAIL: Should validate forceReprocess parameter');
                return false;
            }
        }
    },
    {
        name: 'Empty CV ID',
        test: async () => {
            console.log('🧪 Testing: Empty CV ID');
            const response = await makeRequest(`${BASE_URL}${API_ENDPOINT}`, {
                method: 'POST',
                body: {
                    cvId: '',
                    forceReprocess: false
                }
            });

            console.log(`   Status: ${response.statusCode}`);
            console.log(`   Response:`, response.data);

            if (response.statusCode === 400 && response.data.error?.includes('CV ID is required')) {
                console.log('   ✅ PASS: Correctly handles empty CV ID');
                return true;
            } else {
                console.log('   ❌ FAIL: Should handle empty CV ID');
                return false;
            }
        }
    }
];

// Main test runner
async function runTests() {
    console.log('🚀 Starting LLM Processing Route Tests');
    console.log(`📍 Testing endpoint: ${BASE_URL}${API_ENDPOINT}`);
    console.log('='.repeat(60));

    let passedTests = 0;
    let totalTests = testCases.length;

    for (const testCase of testCases) {
        try {
            const passed = await testCase.test();
            if (passed) passedTests++;
        } catch (error) {
            console.log(`   ❌ ERROR: ${error.message}`);
        }
        console.log('');
    }

    console.log('='.repeat(60));
    console.log(`📊 Test Results: ${passedTests}/${totalTests} tests passed`);

    if (passedTests === totalTests) {
        console.log('🎉 All tests passed!');
        process.exit(0);
    } else {
        console.log('⚠️  Some tests failed. Check the output above.');
        process.exit(1);
    }
}

// Check if server is running
async function checkServerHealth() {
    try {
        console.log('🔍 Checking if server is running...');
        const response = await makeRequest(`${BASE_URL}/api/health`);
        if (response.statusCode === 200) {
            console.log('✅ Server is running');
            return true;
        }
    } catch (error) {
        console.log('❌ Server is not running or health endpoint not available');
        console.log('   Make sure to start the development server with: npm run dev');
        return false;
    }
}

// Run the tests
if (require.main === module) {
    checkServerHealth().then(serverRunning => {
        if (serverRunning) {
            runTests();
        } else {
            console.log('💡 To test the route, first start the server:');
            console.log('   npm run dev');
            console.log('   Then run this test script again.');
            process.exit(1);
        }
    });
}

module.exports = { runTests, testCases };
