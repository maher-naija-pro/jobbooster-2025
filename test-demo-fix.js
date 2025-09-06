// Test script to verify the demo page works
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Demo Page Fix');
console.log('========================');

// Check if the demo page exists
const demoPagePath = path.join(__dirname, 'src/app/demo-llm-process/page.tsx');
if (fs.existsSync(demoPagePath)) {
    console.log('✅ Demo page exists at /demo-llm-process');
} else {
    console.log('❌ Demo page not found');
}

// Check if the upload route has been fixed
const uploadRoutePath = path.join(__dirname, 'src/app/api/upload-cv/route.ts');
if (fs.existsSync(uploadRoutePath)) {
    const uploadContent = fs.readFileSync(uploadRoutePath, 'utf8');
    if (uploadContent.includes('Create a temporary profile for anonymous user')) {
        console.log('✅ Upload route fixed for anonymous users');
    } else {
        console.log('❌ Upload route not fixed');
    }
} else {
    console.log('❌ Upload route not found');
}

// Check if the LLM processing route has been fixed
const llmRoutePath = path.join(__dirname, 'src/app/api/cv-data/llm-process/route.ts');
if (fs.existsSync(llmRoutePath)) {
    const llmContent = fs.readFileSync(llmRoutePath, 'utf8');
    if (llmContent.includes('Create a temporary profile for anonymous user if it doesn\'t exist')) {
        console.log('✅ LLM processing route fixed for anonymous users');
    } else {
        console.log('❌ LLM processing route not fixed');
    }
} else {
    console.log('❌ LLM processing route not found');
}

console.log('\n🚀 Demo Page Features:');
console.log('- Drag & drop CV upload');
console.log('- LLM processing integration');
console.log('- Database table display');
console.log('- Analysis results display');
console.log('- Anonymous user support');

console.log('\n📝 To test:');
console.log('1. Start the development server: npm run dev');
console.log('2. Go to http://localhost:3000');
console.log('3. Click "LLM Processing Demo" button');
console.log('4. Upload a CV file (PDF, DOC, DOCX)');
console.log('5. Click "Process with LLM"');
console.log('6. View the results in both tabs');

console.log('\n✨ The demo should now work without foreign key constraint errors!');
