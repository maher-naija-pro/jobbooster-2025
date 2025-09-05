# Database Architecture Best Practices

## Overview
This document outlines database architecture best practices for Prisma schemas, covering performance optimization, data integrity, scalability, and maintainability.

## 1. Schema Design Principles

### 1.1 Normalization vs Denormalization
- **Normalize frequently queried data** into separate tables
- **Keep rarely accessed data** in JSON fields for flexibility
- **Balance performance** with query complexity

```prisma
// ❌ Avoid: All data in JSON
model CvData {
  personalInfo Json? // Hard to query, index, or validate
}

// ✅ Good: Normalized structure
model PersonalInfo {
  id        String @id @default(cuid())
  cvDataId  String @map("cv_data_id")
  firstName String?
  lastName  String?
  email     String?
  
  @@index([email])
  @@index([cvDataId])
}
```

### 1.2 Consistent Naming Conventions
- Use `snake_case` for database columns with `@map()`
- Use `camelCase` for Prisma field names
- Prefix boolean fields with `is`, `has`, `can`
- Use descriptive, self-documenting names

```prisma
// ✅ Good naming
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  isActive     Boolean  @default(true) @map("is_active")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
}
```

## 2. Data Types and Constraints

### 2.1 Use Enums for Constrained Values
```prisma
enum ProcessingStatus {
  UPLOADED
  PROCESSING
  COMPLETED
  FAILED
  ARCHIVED
}

model CvData {
  processingStatus ProcessingStatus @default(UPLOADED)
}
```

### 2.2 Appropriate Data Types
```prisma
model CvJobMatch {
  // Use Decimal for precise calculations
  overallMatchScore Decimal @db.Decimal(5, 2) // 0.00 to 999.99
  
  // Use appropriate string lengths
  title String @db.VarChar(255)
  
  // Use Text for large content
  description String @db.Text
}
```

### 2.3 Add Check Constraints
```prisma
model CvJobMatch {
  overallMatchScore Decimal @db.Decimal(5, 2)
  
  @@check(overallMatchScore >= 0 AND overallMatchScore <= 100)
}
```

## 3. Indexing Strategy

### 3.1 Single Column Indexes
```prisma
model User {
  email String @unique
  
  @@index([email])        // For lookups
  @@index([createdAt])    // For sorting
  @@index([isActive])     // For filtering
}
```

### 3.2 Composite Indexes
```prisma
model CvData {
  userId      String
  isActive    Boolean
  isLatest    Boolean
  createdAt   DateTime
  
  // Optimize common query patterns
  @@index([userId, isActive, isLatest])
  @@index([processingStatus, createdAt])
  @@index([userId, createdAt DESC])
}
```

### 3.3 Index Guidelines
- **Create indexes** for frequently queried columns
- **Use composite indexes** for multi-column WHERE clauses
- **Order columns** in composite indexes by selectivity (most selective first)
- **Avoid over-indexing** - each index slows down writes

## 4. Relationships and Foreign Keys

### 4.1 Proper Relationship Design
```prisma
model Profile {
  id     String @id @default(cuid())
  userId String @unique @map("user_id")
  
  // One-to-many relationships
  cvData CvData[]
}

model CvData {
  id     String @id @default(cuid())
  userId String @map("user_id")
  
  // Proper foreign key with cascade delete
  profile Profile @relation(fields: [userId], references: [userId], onDelete: Cascade)
}
```

### 4.2 Cascade Delete Strategy
```prisma
// Use CASCADE for dependent data
profile Profile @relation(fields: [userId], references: [userId], onDelete: Cascade)

// Use RESTRICT for critical data
user User @relation(fields: [userId], references: [id], onDelete: Restrict)
```

## 5. Soft Delete Pattern

### 5.1 Implement Soft Delete Consistently
```prisma
model CvData {
  id        String    @id @default(cuid())
  isActive  Boolean   @default(true) @map("is_active")
  deletedAt DateTime? @map("deleted_at")
  
  @@index([deletedAt])
  @@index([isActive, deletedAt])
}
```

### 5.2 Query Patterns for Soft Delete
```typescript
// Get active records only
const activeCvs = await prisma.cvData.findMany({
  where: {
    isActive: true,
    deletedAt: null
  }
})
```

## 6. Performance Optimization

### 6.1 Large Text Field Optimization
```prisma
// Move large text to separate table
model CvContent {
  id            String @id @default(cuid())
  cvDataId      String @map("cv_data_id")
  extractedText String @db.Text
  
  @@index([cvDataId])
}
```

### 6.2 Pagination Strategy
```prisma
model CvJobMatch {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  
  @@index([createdAt DESC])
}
```

### 6.3 Connection Pooling
```typescript
// Configure connection pooling
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?connection_limit=20&pool_timeout=20"
    }
  }
})
```

## 7. Security and Compliance

### 7.1 GDPR Compliance
```prisma
model CvData {
  gdprConsent        Boolean   @default(false) @map("gdpr_consent")
  consentDate        DateTime? @map("consent_date")
  dataRetentionUntil DateTime? @map("data_retention_until")
  anonymizedAt       DateTime? @map("anonymized_at")
}
```

### 7.2 Audit Logging
```prisma
model AuditLog {
  id          String   @id @default(cuid())
  tableName   String   @map("table_name")
  recordId    String   @map("record_id")
  action      String   // INSERT, UPDATE, DELETE
  oldValues   Json?
  newValues   Json?
  userId      String?  @map("user_id")
  ipAddress   String?  @map("ip_address")
  createdAt   DateTime @default(now()) @map("created_at")
  
  @@index([tableName, recordId])
  @@index([userId, createdAt])
}
```

## 8. Scalability Considerations

### 8.1 Data Partitioning
```prisma
model UserActivity {
  id            String   @id @default(cuid())
  partitionDate Date     @map("partition_date") @default(now())
  createdAt     DateTime @default(now())
  
  @@index([partitionDate, createdAt])
}
```

### 8.2 Read Replicas
```typescript
// Use read replicas for heavy read workloads
const readPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.READ_DATABASE_URL
    }
  }
})
```

## 9. Monitoring and Maintenance

### 9.1 Query Performance Tracking
```prisma
model QueryPerformance {
  id            String   @id @default(cuid())
  queryHash     String   @map("query_hash")
  executionTime Int      @map("execution_time") // milliseconds
  rowsReturned  Int      @map("rows_returned")
  createdAt     DateTime @default(now()) @map("created_at")
  
  @@index([queryHash])
  @@index([createdAt])
}
```

### 9.2 Database Maintenance
```sql
-- Regular maintenance queries
VACUUM ANALYZE;                    -- Update statistics
REINDEX DATABASE your_database;    -- Rebuild indexes
```

## 10. Migration Best Practices

### 10.1 Safe Schema Changes
```prisma
// Add nullable fields first
model User {
  newField String? // Add as nullable
}

// Then populate data
// Finally make it required
model User {
  newField String // Make required
}
```

### 10.2 Backward Compatibility
- Always add new fields as nullable initially
- Use feature flags for new functionality
- Maintain API versioning

## 11. Common Anti-Patterns to Avoid

### 11.1 Over-Normalization
```prisma
// ❌ Avoid: Too many small tables
model UserFirstName { id String, userId String, firstName String }
model UserLastName { id String, userId String, lastName String }

// ✅ Better: Logical grouping
model PersonalInfo { 
  id String, userId String, firstName String, lastName String 
}
```

### 11.2 Missing Indexes
```prisma
// ❌ Avoid: No indexes on frequently queried fields
model CvData {
  userId String
  status String
  // No indexes - slow queries
}

// ✅ Good: Proper indexing
model CvData {
  userId String
  status String
  
  @@index([userId])
  @@index([status])
  @@index([userId, status])
}
```

### 11.3 Inconsistent Data Types
```prisma
// ❌ Avoid: Inconsistent types
model User {
  age String    // Should be Int
  id  Int       // Should be String for CUID
}

// ✅ Good: Consistent, appropriate types
model User {
  age Int?
  id  String @id @default(cuid())
}
```

## 12. Testing and Validation

### 12.1 Schema Validation
```typescript
// Validate schema before deployment
const validateSchema = async () => {
  try {
    await prisma.$connect()
    console.log('Schema validation passed')
  } catch (error) {
    console.error('Schema validation failed:', error)
  }
}
```

### 12.2 Data Integrity Tests
```typescript
// Test foreign key constraints
const testDataIntegrity = async () => {
  try {
    await prisma.cvData.create({
      data: {
        userId: 'non-existent-user',
        // Should fail due to foreign key constraint
      }
    })
  } catch (error) {
    console.log('Foreign key constraint working correctly')
  }
}
```

## 13. Performance Monitoring

### 13.1 Query Analysis
```sql
-- Monitor slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### 13.2 Index Usage
```sql
-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

## 14. Backup and Recovery

### 14.1 Backup Strategy
```bash
# Full database backup
pg_dump -h localhost -U username -d database_name > backup.sql

# Schema-only backup
pg_dump -h localhost -U username -d database_name --schema-only > schema.sql
```

### 14.2 Point-in-Time Recovery
```bash
# Enable WAL archiving
archive_mode = on
archive_command = 'cp %p /path/to/archive/%f'
```

## Conclusion

Following these best practices will help create a robust, scalable, and maintainable database architecture. Regular monitoring, testing, and optimization are essential for long-term success.

Remember to:
- Start simple and add complexity as needed
- Monitor performance regularly
- Test changes in development first
- Document schema decisions
- Keep backups current
- Plan for growth and scaling
