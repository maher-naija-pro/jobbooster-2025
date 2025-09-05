


 for cv data 

####  Personal Information Fields
```sql
-- Personal information extraction
personal_info JSON, -- Name, contact info, location
professional_summary TEXT, -- Professional summary/summary
email VARCHAR(255), -- Email address
phone VARCHAR(50), -- Phone number
location VARCHAR(255), -- Location/address
linkedin_url VARCHAR(500), -- LinkedIn profile URL
website_url VARCHAR(500), -- Personal website URL
```
for cv data 
####  Skills and Experience Fields
```sql
-- Skills and experience data
technical_skills JSON, -- Array of technical skills
soft_skills JSON, -- Array of soft skills
languages JSON, -- Languages spoken
certifications JSON, -- Certifications and licenses
projects JSON, -- Notable projects and achievements

```
 for cv data 
####  Education Fields
```sql
-- Education information
education JSON, -- Educational background details
-- Structure: [{"degree": "string", "institution": "string", "year": "string", "relevance": "high|medium|low", "skills": ["skill1", "skill2"]}]
```


for cv data and job data table 


#### 6. Analysis Quality and Confidence
```sql
-- Analysis quality metrics
analysis_confidence DECIMAL(3,2), -- Overall confidence in analysis
extraction_quality JSON, -- Quality metrics for each extraction
completeness_score DECIMAL(3,2), -- How complete the CV information is
consistency_score DECIMAL(3,2), -- Internal consistency of information
```



for job   data 

#### 1. Job Basic Information
```sql
-- Basic job information
title VARCHAR(255), -- Job title
company_name VARCHAR(255), -- Company name
industry VARCHAR(100), -- Industry sector
location VARCHAR(255), -- Job location
company_size VARCHAR(50), -- Company size (startup/small/medium/large/enterprise)
salary_range VARCHAR(100), -- Salary range if mentioned
experience_level VARCHAR(20), -- Required experience level (entry/mid/senior/lead)
```
for job data 
#### 2. Requirements Analysis
```sql
-- Enhanced requirements tracking
hard_requirements JSON, -- Must-have requirements
soft_requirements JSON, -- Nice-to-have requirements
technical_requirements JSON, -- Technical skills required
experience_requirements JSON, -- Experience level requirements
education_requirements JSON, -- Education requirements
requirements JSON, -- General requirements array
keywords JSON, -- Keywords extracted from job posting
```
 for job data 
#### 3. Job Metadata
```sql
-- Job posting metadata
job_type VARCHAR(20), -- Type of employment (full-time/part-time/contract/internship)
remote_type VARCHAR(20), -- Remote work type (remote/hybrid/onsite)
department VARCHAR(100), -- Department
employment_type VARCHAR(50), -- Employment type
```




