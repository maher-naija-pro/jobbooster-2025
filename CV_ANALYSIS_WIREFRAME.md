# CV Analysis Component Wireframe

## Overview
This wireframe shows the CV analysis display component with two modes: Compact and Detailed analysis.

## Component Structure

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CV Analysis Results                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ [👁️ Compact] [👁️‍🗨️ Detailed] ← Mode Toggle Buttons                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## COMPACT MODE

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CV Analysis Results                                   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ [👁️ Compact] [👁️‍🗨️ Detailed] ← Mode Toggle                            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Overall Match Score                                  │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ 🎯 85%                                                          │   │   │
│  │  │ ████████████████████████████████████████████████████████████    │   │   │
│  │  │ Good match                                                      │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Quick Stats                                     │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                    │   │
│  │  │ ✅ 12       │  │ ⚠️ 3        │  │ ⭐ 8        │                    │   │
│  │  │ Perfect     │  │ Missing     │  │ Strengths   │                    │   │
│  │  │ Matches     │  │ Skills      │  │             │                    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Detailed Skill Comparison                           │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ Skill Name    │ Job Required │ CV Level    │ Match │ Status     │   │   │
│  │  │───────────────│──────────────│─────────────│───────│────────────│   │   │
│  │  │ React         │ ✅ Required  │ ✅ Expert   │ 95%   │ ✅ Perfect │   │   │
│  │  │ TypeScript    │ ✅ Required  │ ⚠️ Intermed │ 70%   │ ⚠️ Minor   │   │   │
│  │  │ Node.js       │ ✅ Required  │ ⚠️ Intermed │ 75%   │ ⚠️ Minor   │   │   │
│  │  │ AWS           │ ⚠️ Preferred │ ❌ Beginner │ 30%   │ ❌ Major   │   │   │
│  │  │ Docker        │ ❌ Optional  │ ❌ None     │ 0%    │ ❌ Gap     │   │   │
│  │  │ Python        │ ❌ Optional  │ ✅ Advanced │ 85%   │ ➕ Extra   │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   ││                                                                                 │
                                                                        │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Key Recommendations                                 │   │
│  │  • Improve TypeScript skills for better type safety                    │   │
│  │  • Gain experience with cloud platforms (AWS/Azure)                    │   │
│  │  • Learn containerization with Docker                                  │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## DETAILED MODE

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        Detailed CV Analysis                                    │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ [👁️ Compact] [👁️‍🗨️ Detailed] ← Mode Toggle                            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Overall Match Score                                  │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ 🎯 85%                                                          │   │   │
│  │  │ ████████████████████████████████████████████████████████████    │   │   │
│  │  │ Good match                                                      │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Detailed Skill Comparison                           │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ Skill Name    │ Job Required │ CV Level    │ Match │ Status     │   │   │
│  │  │───────────────│──────────────│─────────────│───────│────────────│   │   │
│  │  │ React         │ ✅ Required  │ ✅ Expert   │ 95%   │ ✅ Perfect │   │   │
│  │  │ TypeScript    │ ✅ Required  │ ⚠️ Intermed │ 70%   │ ⚠️ Minor   │   │   │
│  │  │ Node.js       │ ✅ Required  │ ⚠️ Intermed │ 75%   │ ⚠️ Minor   │   │   │
│  │  │ AWS           │ ⚠️ Preferred │ ❌ Beginner │ 30%   │ ❌ Major   │   │   │
│  │  │ Docker        │ ❌ Optional  │ ❌ None     │ 0%    │ ❌ Gap     │   │   │
│  │  │ Python        │ ❌ Optional  │ ✅ Advanced │ 85%   │ ➕ Extra   │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │                                                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                          Job Analysis                                  │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ 🏢 TechCorp     │  │ 🎯 Senior       │  │ 📍 Remote       │        │   │
│  │  │ Company         │  │ Level           │  │ Location        │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ 👥 Large        │  │ 💼 Technology   │  │ 💰 $80k-120k    │        │   │
│  │  │ Company Size    │  │ Industry        │  │ Salary Range    │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │                                                                         │   │
│  │  Key Requirements: [React] [TypeScript] [Node.js] [AWS] [Agile]        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Extracted Skills Analysis                           │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ JavaScript      │  │ React           │  │ Node.js         │        │   │
│  │  │ [technical]     │  │ [technical]     │  │ [technical]     │        │   │
│  │  │ Level: Advanced │  │ Level: Expert   │  │ Level: Intermed │        │   │
│  │  │ Conf: 95%      │  │ Conf: 90%      │  │ Conf: 85%      │        │   │
│  │  │ 5 years exp    │  │ 4 years exp    │  │ 3 years exp    │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │  │ Communication   │  │ Leadership      │  │ Problem Solving │        │   │
│  │  │ [soft]          │  │ [soft]          │  │ [soft]          │        │   │
│  │  │ Level: Advanced │  │ Level: Expert   │  │ Level: Advanced │        │   │
│  │  │ Conf: 88%      │  │ Conf: 92%      │  │ Conf: 90%      │        │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Experience Analysis                             │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ Senior Frontend Developer                    Relevance: 95%     │   │   │
│  │  │ TechCorp Inc. • 2021-2024                    ████████████████   │   │   │
│  │  │                                                                 │   │   │
│  │  │ Led development of customer-facing web applications using       │   │   │
│  │  │ React, TypeScript, and modern frontend frameworks...            │   │   │
│  │  │                                                                 │   │   │
│  │  │ Skills: [React] [TypeScript] [Redux] [Jest] [Webpack]          │   │   │
│  │  │                                                                 │   │   │
│  │  │ Key Achievements:                                               │   │   │
│  │  │ 🏆 Improved application performance by 40%                      │   │   │
│  │  │ 🏆 Led team of 5 developers                                     │   │   │
│  │  │ 🏆 Implemented CI/CD pipeline                                   │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ Frontend Developer                          Relevance: 78%     │   │   │
│  │  │ StartupXYZ • 2019-2021                      ████████████       │   │   │
│  │  │                                                                 │   │   │
│  │  │ Developed responsive web applications and collaborated with     │   │   │
│  │  │ cross-functional teams...                                       │   │   │
│  │  │                                                                 │   │   │
│  │  │ Skills: [JavaScript] [Vue.js] [CSS3] [HTML5] [Git]             │   │   │
│  │  │                                                                 │   │   │
│  │  │ Key Achievements:                                               │   │   │
│  │  │ 🏆 Built 3 major features from scratch                          │   │   │
│  │  │ 🏆 Reduced bug reports by 60%                                   │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Education Analysis                              │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ Bachelor of Computer Science                    [high relevance] │   │   │
│  │  │ University of Technology • 2019                                 │   │   │
│  │  │ Skills: [Algorithms] [Data Structures] [Software Engineering]   │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │ AWS Certified Developer                    [medium relevance]   │   │   │
│  │  │ Amazon Web Services • 2022                                     │   │   │
│  │  │ Skills: [Cloud Computing] [AWS Services] [DevOps]              │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │

│                                                                                 │

│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ [▼] Strengths (8) ← Collapsible Section                                │   │
│  │ ✅ Strong React and JavaScript expertise                               │   │
│  │ ✅ Proven leadership and team management skills                        │   │
│  │ ✅ Excellent problem-solving abilities                                 │   │
│  │ ✅ Experience with modern development tools                            │   │
│  │ ✅ Strong communication and collaboration skills                       │   │
│  │ ✅ Track record of delivering high-quality software                    │   │
│  │ ✅ Experience with agile development methodologies                     │   │
│  │ ✅ Continuous learning and adaptation to new technologies              │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │ [▼] Missing Skills (3) ← Collapsible Section                          │   │
│  │ ⚠️ AWS Cloud Services                                                  │   │
│  │ ⚠️ Docker and Containerization                                         │   │
│  │ ⚠️ Advanced TypeScript features                                        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Detailed Recommendations                            │   │
│  │  • Improve TypeScript skills by learning advanced features like       │   │
│  │    generics, decorators, and advanced type manipulation               │   │
│  │  • Gain hands-on experience with AWS services through practical       │   │
│  │    projects and certifications                                         │   │
│  │  • Learn Docker and containerization to modernize deployment          │   │
│  │    processes and improve scalability                                   │   │
│  │  • Consider taking AWS Certified Developer Associate certification    │   │
│  │  • Practice with microservices architecture and cloud-native          │   │
│  │    development patterns                                                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        Analysis Details                                │   │
│  │  Processing Time: 2,450ms  │  Confidence: 92%  │  Version: 1.0.0     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Key Features

### Mode Toggle
- **Compact Mode**: Quick overview with essential information
- **Detailed Mode**: Comprehensive analysis with all available data

### Color Coding
- 🟢 **Green**: Perfect matches, high relevance, strengths
- 🟡 **Yellow**: Minor gaps, medium relevance, warnings
- 🔴 **Red**: Major gaps, low relevance, missing skills
- 🔵 **Blue**: Extra skills, bonus qualifications

### Interactive Elements
- **Collapsible Sections**: Strengths and Missing Skills can be expanded/collapsed
- **Mode Toggle**: Switch between Compact and Detailed views
- **Progress Bars**: Visual representation of match scores and relevance
- **Category Badges**: Color-coded skill categories (technical, soft, language, etc.)

### Data Sections

#### Compact Mode Includes:
1. Overall Match Score with progress bar
2. Quick Stats (Perfect Matches, Missing Skills, Strengths)
3. Top 6 Skill Matches with color-coded status
4. Key Recommendations (top 3)

#### Detailed Mode Includes:
1. **Job Analysis**: Company info, level, location, industry, salary
2. **Skills Analysis**: All extracted skills with categories, levels, confidence
3. **Experience Analysis**: Detailed job history with relevance scores
4. **Education Analysis**: Academic background with relevance ratings
5. **Overall Match Score**: Visual progress indicator
6. **Detailed Skill Comparison**: Complete table with all skill matches
7. **Strengths**: Collapsible list of all identified strengths
8. **Missing Skills**: Collapsible list of skills gaps
9. **Detailed Recommendations**: All actionable recommendations
10. **Analysis Metadata**: Processing time, confidence, version info

This wireframe shows a comprehensive CV analysis interface that provides both quick insights and detailed analysis based on user needs.
