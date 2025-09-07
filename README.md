# Job Application Enhancer

A comprehensive tool designed to help users create tailored job application materials using AI-powered content generation with real-time streaming.

## Features

### Core Functionality
- **CV/Resume Upload**: Drag-and-drop PDF upload with file validation
- **Multi-language Support**: 12+ languages including English, French, Spanish, German, etc.
- **Job Offer Analysis**: Large text area for job description input with validation
- **Real-time AI Generation**: Streaming cover letter and email generation with character-by-character display
- **Export Options**: PDF, Word, and text export functionality
- **Responsive Design**: Mobile-first approach with touch-friendly interface

### Technical Features
- **Next.js 15.5.2** with React 19.1.0
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **OpenAI Integration** with streaming API
- **Real-time Streaming** content generation
- **State Management** with React Context

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- OpenAI API key (or Ollama for local AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jobbooster-2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory:

   ```bash
   # OpenAI Configuration (choose one option)

   # Option 1: OpenAI API
   OPENAI_API_KEY=your_openai_api_key_here
   OPENAI_BASE_URL=https://api.openai.com/v1
   OPENAI_MODEL=gpt-4

   # Option 2: Ollama (local AI)
   OPENAI_API_KEY=ollama
   OPENAI_BASE_URL=http://localhost:11434/v1
   OPENAI_MODEL=llama2

   # Supabase Configuration (Required for avatar uploads)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_url
   ```

4. **Configure Supabase Storage Policies**

   To enable avatar uploads, you need to configure Row Level Security (RLS) policies in your Supabase dashboard:

   1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
   2. Select your project
   3. Go to **SQL Editor** in the left sidebar
   4. Run the following SQL to create storage policies:

   ```sql
   -- Allow all authenticated users to manage avatars
   CREATE POLICY "Authenticated users can manage avatars" ON storage.objects
   FOR ALL USING (
     bucket_id = 'avatars' 
     AND auth.role() = 'authenticated'
   );

   -- Allow public read access to avatars
   CREATE POLICY "Public can view avatars" ON storage.objects
   FOR SELECT USING (bucket_id = 'avatars');
   ```

   **Note**: The avatars bucket will be created automatically when a user first uploads an avatar.

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:3000`

## Usage

### Basic Workflow

1. **Upload CV/Resume**
   - Drag and drop your PDF, DOC, or DOCX file
   - File size limit: 10MB
   - Real-time validation and processing

2. **Select Language**
   - Choose from 12+ supported languages
   - Content will be generated in selected language

3. **Input Job Description**
   - Paste the complete job posting
   - Minimum 100 characters required
   - Clear button available for easy reset

4. **Generate Content**
   - **Generate Letter**: Creates personalized cover letter
   - **Generate Mail**: Creates professional application email
   - Real-time streaming with character-by-character display

5. **Download/Export**
   - PDF format for professional documents
   - Word document (.docx) for editing
   - Plain text (.txt) for copying

## API Endpoints

### CV Upload
```
POST /api/upload-cv
```
- Accepts multipart/form-data with file
- Validates file type and size
- Returns processed CV data

### Cover Letter Generation
```
POST /api/generate-letter
```
- Accepts CV data, job analysis, and language
- Returns streaming response with generated content
- Real-time character-by-character streaming

### Email Generation
```
POST /api/generate-email
```
- Accepts CV data, job analysis, and language
- Returns streaming response with generated email
- Supports different email types (application, follow-up, inquiry)

## Component Architecture

### Main Components
- `CVUpload`: File upload with drag-and-drop
- `LanguageSelector`: Multi-language dropdown
- `JobOfferInput`: Text area for job descriptions
- `ActionButtons`: Generation controls with loading states
- `ContentGenerator`: Real-time streaming display

### State Management
- React Context API for global state
- TypeScript interfaces for type safety
- Reducer pattern for complex state updates

## Development

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure
```
src/
├── app/
│   ├── api/           # API routes
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Main page
├── components/        # React components
├── lib/              # Utilities and types
│   ├── types.ts      # TypeScript interfaces
│   ├── utils.ts      # Utility functions
│   ├── openai.ts     # OpenAI configuration
│   └── app-context.tsx # State management
└── styles/           # Global styles
```

## Deployment

### Environment Variables for Production
```bash
OPENAI_API_KEY=your_production_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4
NODE_ENV=production
```

### Build Commands
```bash
npm run build
npm run start
```

## Troubleshooting

### Supabase Storage Issues

If you encounter "new row violates row-level security policy" errors when uploading avatars:

1. **Verify RLS policies are configured**:
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE tablename = 'objects' AND schemaname = 'storage';
   ```

2. **Check if the avatars bucket exists**:
   ```sql
   SELECT * FROM storage.buckets WHERE name = 'avatars';
   ```

3. **Verify environment variables**:
   - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
   - Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are valid

### Common Issues

- **Avatar upload fails**: Make sure you've run the SQL policies in your Supabase dashboard
- **File size errors**: Check that files are under 5MB limit
- **Authentication errors**: Verify user is properly authenticated before upload

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.