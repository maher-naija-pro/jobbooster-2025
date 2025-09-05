# Job Description Table Design

## 📋 Overview

This document outlines the design for storing job descriptions  results in the JobBooster application. The structure implements a **many-to-many relationship** between job offers and analyses, allowing:

- **One job offer** to have **multiple analyses** (different CVs, different analysis types, re-analysis over time)



## 🏗️ Table Structure

### **Primary Table: `job_data`**

The main table for storing job description data with comprehensive tracking and metadata fields.

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `id` | `id` | String (Primary Key) | Unique identifier (CUID) |
| `userId` | `user_id` | String | Foreign key to profiles table |
| `content` | `content` | String | Job description |
| `title` | `title` | String (Nullable) | Job title |
| `company` | `company` | String (Nullable) | Company name |
| `status` | `status` | String | Processing status (default: "uploaded") |

### **Processing & Analysis Fields**

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `processingStatus` | `processing_status` | String | Processing status: 'uploaded', 'extracting', 'analyzing', 'completed', 'failed' |
| `processingStartedAt` | `processing_started_at` | DateTime (Nullable) | When processing began |
| `processingCompletedAt` | `processing_completed_at` | DateTime (Nullable) | When processing finished |
| `processingError` | `processing_error` | String (Nullable) | Error message if processing failed |
| `processingTime` | `processing_time` | Integer (Nullable) | Processing time in milliseconds |
| `modelUsed` | `model_used` | String (Nullable) | AI model used for analysis |
| `parameters` | `parameters` | JSON (Nullable) | Analysis parameters used |
| `errorMessage` | `error_message` | String (Nullable) | Error message if analysis failed |
| `analysisId` | `analysis_id` | String (Nullable) | Link to analysis results |
| `analysisVersion` | `analysis_version` | String (Nullable) | Analysis algorithm version |

### **Extracted Data Fields**

Fields for storing AI-extracted information from job descriptions:

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `extractedSkills` | `extracted_skills` | JSON (Nullable) | Array of extracted skills |
| `requiredQualifications` | `required_qualifications` | JSON (Nullable) | Required qualifications |
| `preferredQualifications` | `preferred_qualifications` | JSON (Nullable) | Preferred qualifications |

### **Job-Specific Metadata Fields**

Fields specific to job description context:

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `jobType` | `job_type` | String (Nullable) | Type: 'full-time', 'part-time', 'contract', 'internship' |
| `location` | `location` | String (Nullable) | Job location (city, state, country) |
| `remoteType` | `remote_type` | String (Nullable) | Remote work type: 'remote', 'hybrid', 'onsite' |
| `salaryRange` | `salary_range` | String (Nullable) | Salary range if provided |
| `experienceLevel` | `experience_level` | String (Nullable) | Required experience: 'entry', 'mid', 'senior', 'executive' |
| `industry` | `industry` | String (Nullable) | Industry sector |
| `department` | `department` | String (Nullable) | Department within company |
| `employmentType` | `employment_type` | String (Nullable) | Employment type classification |

### **User Interaction Tracking**

Fields to track user engagement and usage patterns:

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `viewCount` | `view_count` | Integer | Number of times viewed (default: 0) |
| `lastAnalyzedAt` | `last_analyzed_at` | DateTime (Nullable) | Last time analysis was performed |
| `analysisCount` | `analysis_count` | Integer | Number of times analyzed (default: 0) |

### **Security & Compliance Fields**

Data privacy and compliance support:

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `isPublic` | `is_public` | Boolean | Whether job is publicly visible (default: false) |
| `retentionDate` | `retention_date` | DateTime (Nullable) | When to auto-delete |
| `gdprConsent` | `gdpr_consent` | Boolean | GDPR consent for data processing (default: false) |
| `isActive` | `is_active` | Boolean | Whether job posting is still active (default: true) |
| `dataClassification` | `data_classification` | String (Nullable) | Data classification: 'public', 'internal', 'confidential' |

### **Performance & Optimization Fields**

Caching and performance optimization:

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `isArchived` | `is_archived` | Boolean | Whether archived (default: false) |
| `archiveDate` | `archive_date` | DateTime (Nullable) | When archived |

### **Standard Timestamps**

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `createdAt` | `created_at` | DateTime | Record creation timestamp |
| `updatedAt` | `updated_at` | DateTime | Last update timestamp |