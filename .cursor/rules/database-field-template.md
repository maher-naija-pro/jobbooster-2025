# Database Field Categories Template

This document provides a comprehensive template of field categories that can be reused across different database tables. Each category includes common field patterns, data types, and naming conventions.

## 1. Identification & Ownership

**Purpose**: Unique identification and ownership tracking

### Core Fields
```prisma
id                      String   @id @default(cuid()) // Unique record ID
userId                  String   @map("user_id") // Owner user ID
```



## 1. Status & Processing

**Purpose**: Record lifecycle and processing state management

### Core Fields
```prisma
processingStatus        ProcessingStatus @default(UPLOADED) @map("processing_status") // Processing pipeline status
isActive                Boolean  @default(true) @map("is_active") // Is this record active
isArchived              Boolean  @default(false) @map("is_archived") // Is this record archived
isPublic                Boolean  @default(false) @map("is_public") // Is this record public
isLatest                Boolean  @default(true) @map("is_latest") // Is this the latest version
priority                Int?     @default(0) // Processing priority
archiveDate             DateTime? @map("archive_date") // Date archived
retentionDate           DateTime? @map("retention_date") // Data retention date
deletedAt               DateTime? @map("deleted_at") // Soft delete timestamp
```

## 4. Processing Timestamps & Error Tracking

**Purpose**: Processing pipeline monitoring and error handling

### Core Fields
```prisma
createdAt               DateTime @default(now()) @map("created_at") // Record creation timestamp
updatedAt               DateTime @updatedAt @map("updated_at") // Last update timestamp
processingStartedAt     DateTime? @map("processing_started_at") // When processing started
processingCompletedAt   DateTime? @map("processing_completed_at") // When processing finished
processingError         String?  @map("processing_error") // Processing error details
processingTime          Int?     @map("processing_time") // Processing time in milliseconds
retryCount              Int      @default(0) @map("retry_count") // Number of retry attempts
lastRetryAt             DateTime? @map("last_retry_at") // Last retry timestamp
```

## 5. Analysis & Versioning

**Purpose**: Data analysis tracking and version control

### Core Fields
```prisma
analysisCount           Int      @default(0) @map("analysis_count") // Number of analyses performed
lastAnalyzedAt          DateTime? @map("last_analyzed_at") // Last analysis timestamp
version                 Int      @default(1) // Version number
```

## 6. Privacy & Compliance

**Purpose**: Data privacy and regulatory compliance

### Core Fields
```prisma
gdprConsent             Boolean  @default(false) @map("gdpr_consent") // GDPR consent flag
dataClassification      String?  @map("data_classification") @db.VarChar(50) // Data classification level
retentionPolicy         String?  @map("retention_policy") @db.VarChar(100) // Retention policy applied
consentDate             DateTime? @map("consent_date") // Date consent was given
consentVersion          String?  @map("consent_version") @db.VarChar(20) // Consent version
```

## 7. View & Priority

**Purpose**: User interaction tracking and content prioritization

### Core Fields
```prisma
viewCount               Int      @default(0) @map("view_count") // Number of times viewed
priority                Int?     @default(0) // Content priority score
lastViewedAt            DateTime? @map("last_viewed_at") // Last view timestamp
```






