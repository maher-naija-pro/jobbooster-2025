# CV Data Table Enhancement Recommendations

## 📋 Current Table Structure

The current `cv_data` table in the JobBooster application has the following structure:

| **Prisma Field Name** | **Database Column Name** | **Type** | **Description** |
|----------------------|-------------------------|----------|-----------------|
| `id` | `id` | String (Primary Key) | Unique identifier (CUID) |
| `userId` | `user_id` | String | Foreign key to profiles table |
| `fileName` | `file_name` | String | Original filename of uploaded CV |
| `fileUrl` | `file_url` | String | URL/path to the stored file |
| `fileSize` | `file_size` | Integer | Size of the file in bytes |
| `mimeType` | `mime_type` | String | MIME type of the file (e.g., application/pdf) |
| `status` | `status` | String | Processing status (default: "uploaded") |
| `extractedText` | `extracted_text` | String (Nullable) | Text extracted from the CV file |
| `metadata` | `metadata` | JSON (Nullable) | Additional metadata about the file |
| `createdAt` | `created_at` | DateTime | Timestamp when record was created |
| `updatedAt` | `updated_at` | DateTime | Timestamp when record was last updated |

## 🚀 Recommended Field Enhancements

### **Processing & Analysis Fields**

These fields enhance the CV processing pipeline and provide better tracking of analysis results:

```sql
-- Processing status tracking
processing_status VARCHAR(50) DEFAULT 'uploaded' -- 'uploaded', 'extracting', 'analyzing', 'completed', 'failed'
processing_started_at TIMESTAMP
processing_completed_at TIMESTAMP
processing_error TEXT
processing_time INTEGER -- Processing time in milliseconds
model_used VARCHAR(100) -- AI model used for analysis
parameters JSON -- Analysis parameters used
error_message TEXT -- Specific error message if analysis failed

-- Analysis results storage
analysis_id VARCHAR(255) -- Link to analysis results
analysis_version VARCHAR(20) -- Track analysis algorithm version
```


### **Enhanced Metadata Fields**

These fields provide additional context and improve file management:

```sql
-- File processing metadata
original_filename VARCHAR(500) -- Store original filename before sanitization
```

### **CV-Specific Extracted Data Fields**

These fields store AI-extracted information from CV files for better analysis and matching:

```sql
-- CV data extraction results
extracted_skills JSON -- Array of skills extracted from CV
extracted_experience INTEGER -- Years of experience extracted
extracted_education JSON -- Education details (degrees, institutions)
extracted_certifications JSON -- Professional certifications found
extracted_languages JSON -- Languages mentioned in CV
```

### **User Interaction Tracking**

These fields help track user engagement and usage patterns:

```sql
-- User interaction tracking
view_count INTEGER DEFAULT 0
last_analyzed_at TIMESTAMP
analysis_count INTEGER DEFAULT 0
```

### **Security & Compliance Fields**

These fields support data privacy and compliance requirements:

```sql
-- Data privacy & compliance
is_public BOOLEAN DEFAULT FALSE
is_active BOOLEAN DEFAULT TRUE -- Whether CV is still active/current
retention_date TIMESTAMP -- When to auto-delete
gdpr_consent BOOLEAN DEFAULT FALSE
data_classification VARCHAR(20) -- 'public', 'internal', 'confidential'
```

### **Performance & Optimization Fields**

These fields support caching and performance optimization:

```sql
-- Caching and optimization
is_archived BOOLEAN DEFAULT FALSE
archive_date TIMESTAMP
```



