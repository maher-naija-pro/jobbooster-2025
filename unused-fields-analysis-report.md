#### Security & Authentication Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `lastPasswordChange` | DateTime? | Last password change timestamp | ❌ Unused |
| `failedLoginAttempts` | Int | Failed login attempts counter | ❌ Unused |
| `accountLockedUntil` | DateTime? | Account lockout until timestamp | ❌ Unused |
| `twoFactorEnabled` | Boolean | 2FA enabled flag | ❌ Unused |
| `securityQuestions` | Json? | Security questions JSON | ❌ Unused |

#### Email Verification Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `emailVerified` | Boolean | Email verification status | ❌ Unused |
| `emailVerifiedAt` | DateTime? | When email was verified | ❌ Unused |
| `emailVerificationStatus` | String | Verification status string | ❌ Unused |
| `emailVerificationAttempts` | Int | Number of verification attempts | ❌ Unused |
| `lastVerificationSent` | DateTime? | Last time verification email was sent | ❌ Unused |

#### User Engagement & Analytics Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `lastLoginAt` | DateTime? | Last login timestamp | ❌ Unused |
| `loginCount` | Int | Total login count | ❌ Unused |
| `totalSessionTime` | Int | Total session time in minutes | ❌ Unused |
| `averageSessionDuration` | Int? | Average session duration | ❌ Unused |
| `featureUsageStats` | Json? | Feature usage statistics | ❌ Unused |
| `lastActiveAt` | DateTime? | Last activity timestamp | ❌ Unused |
| `streakDays` | Int | Consecutive active days | ❌ Unused |
| `longestStreak` | Int | Longest active streak | ❌ Unused |

#### User Preferences & Customization Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `preferredJobTypes` | Json? | Array of preferred job types | ❌ Unused |
| `preferredLocations` | Json? | Array of preferred locations | ❌ Unused |
| `salaryExpectations` | Json? | Salary range preferences | ❌ Unused |
| `careerGoals` | String? | Career objectives text | ❌ Unused |
| `skillInterests` | Json? | Skills user wants to develop | ❌ Unused |
| `industryPreferences` | Json? | Preferred industries | ❌ Unused |

#### Enhanced Analytics Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `careerStage` | CareerStage? | Career stage enum | ❌ Unused |
| `skillGaps` | Json? | Identified skill gaps | ❌ Unused |

#### Subscription & Billing Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `subscriptionStatus` | String? | Subscription status string | ❌ Unused |
| `subscriptionStartDate` | DateTime? | When subscription started | ❌ Unused |
| `subscriptionEndDate` | DateTime? | When subscription ends | ❌ Unused |
| `billingCycle` | String? | Billing cycle (monthly, yearly) | ❌ Unused |
| `paymentMethod` | String? | Payment method string | ❌ Unused |
| `trialEndsAt` | DateTime? | Trial period end | ❌ Unused |
| `isTrialUser` | Boolean | Is currently on trial | ❌ Unused |

#### Data Quality & Monitoring Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `errorCount` | Int | Error count | ❌ Unused |
| `warningCount` | Int | Warning count | ❌ Unused |

---

### 2. CvData Model - Unused Fields (15+ fields)

#### Skills, Experience, and Education (Legacy JSON Fields)
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `technicalSkills` | Json? | Array of technical skills (legacy) | ❌ Unused |
| `softSkills` | Json? | Array of soft skills (legacy) | ❌ Unused |
| `languages` | Json? | Languages spoken (legacy) | ❌ Unused |
| `certifications` | Json? | Certifications and licenses | ❌ Unused |
| `education` | Json? | Educational background details | ❌ Unused |
| `workExperience` | Json? | Work experience details | ❌ Unused |
| `projects` | Json? | Notable projects and achievements | ❌ Unused |

#### Content Quality Metrics (Commented Out)
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `completenessScore` | Decimal? | CV completeness (0-1) | ❌ Unused (Commented) |
| `readabilityScore` | Decimal? | Content readability | ❌ Unused (Commented) |
| `atsScore` | Decimal? | ATS compatibility score | ❌ Unused (Commented) |
| `keywordDensity` | Json? | Keyword density analysis | ❌ Unused (Commented) |
| `improvementSuggestions` | Json? | AI-generated suggestions | ❌ Unused (Commented) |
| `templateTags` | Json? | Template tags for search | ❌ Unused (Commented) |

#### Enhanced Analytics Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `averageMatchScore` | Decimal? | Average job match score | ❌ Unused |
| `bestMatchScore` | Decimal? | Best job match score | ❌ Unused |
| `totalJobMatches` | Int | Total job matches generated | ❌ Unused |

---

### 3. JobData Model - Unused Fields (20+ fields)

#### Requirements & Qualifications Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `educationRequirements` | Json? | Education requirements | ❌ Unused |
| `experienceRequirements` | Json? | Experience requirements | ❌ Unused |
| `hardRequirements` | Json? | Hard requirements (skills, certs) | ❌ Unused |
| `softRequirements` | Json? | Soft requirements (communication) | ❌ Unused |
| `softSkillRequirements` | Json? | Soft skill requirements | ❌ Unused |
| `technicalRequirements` | Json? | Technical skills required | ❌ Unused |

#### Market Intelligence Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `marketDemand` | Decimal? | Job market demand score | ❌ Unused |
| `competitionLevel` | Decimal? | Competition level | ❌ Unused |
| `averageSalary` | Decimal? | Market average salary | ❌ Unused |
| `salaryPercentile` | Int? | Salary percentile | ❌ Unused |
| `growthTrend` | String? | Growth trend string | ❌ Unused |
| `skillTrends` | Json? | Trending skills for this role | ❌ Unused |
| `locationDemand` | Json? | Demand by location | ❌ Unused |

#### Job Quality Metrics Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `jobQualityScore` | Decimal? | Overall job quality | ❌ Unused |
| `descriptionClarity` | Decimal? | Description clarity | ❌ Unused |
| `requirementsClarity` | Decimal? | Requirements clarity | ❌ Unused |
| `benefitsScore` | Decimal? | Benefits attractiveness | ❌ Unused |

#### Company Intelligence Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `companyRating` | Decimal? | Company rating | ❌ Unused |
| `companySizeCategory` | String? | Size category | ❌ Unused |
| `companyGrowthStage` | CompanyGrowthStage? | Growth stage enum | ❌ Unused |
| `companyCulture` | Json? | Company culture indicators | ❌ Unused |
| `diversityScore` | Decimal? | Diversity score | ❌ Unused |

---

### 4. CvJobMatch Model - Unused Fields (15+ fields)

#### Match Scores Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `overallMatchScore` | Decimal? | Overall match score (0-100) | ❌ Unused |
| `skillsMatchScore` | Decimal? | Skills match score | ❌ Unused |
| `experienceMatchScore` | Decimal? | Experience match score | ❌ Unused |
| `educationMatchScore` | Decimal? | Education match score | ❌ Unused |
| `locationMatchScore` | Decimal? | Location match score | ❌ Unused |
| `salaryMatchScore` | Decimal? | Salary match score | ❌ Unused |

#### Analysis Quality Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `analysisConfidence` | Decimal? | Overall confidence in analysis | ❌ Unused |
| `completenessScore` | Decimal? | How complete the CV information is | ❌ Unused |
| `consistencyScore` | Decimal? | Internal consistency of information | ❌ Unused |

#### Skills & Analysis Details Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `matchedSkills` | Json? | Skills that matched | ❌ Unused |
| `missingSkills` | Json? | Skills missing from CV | ❌ Unused |
| `extraSkills` | Json? | Extra skills | ❌ Unused |
| `matchReasons` | Json? | Reasons for match | ❌ Unused |
| `improvementSuggestions` | Json? | Suggestions for improvement | ❌ Unused |
| `lastDownloadedAt` | DateTime? | Last time analysis downloaded | ❌ Unused |

#### Analysis Metadata Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `analysisVersion` | String? | Analysis version | ❌ Unused |
| `modelUsed` | String? | Model used for analysis | ❌ Unused |
| `analysisDuration` | Int? | Analysis duration in milliseconds | ❌ Unused |

---

### 5. GeneratedContent Model - Unused Fields (10+ fields)

#### Content Quality & Effectiveness Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `effectivenessScore` | Decimal? | Content effectiveness | ❌ Unused |
| `userRating` | Decimal? | User rating (1-5) | ❌ Unused |
| `feedback` | String? | User feedback | ❌ Unused |
| `improvementSuggestions` | Json? | AI suggestions for improvement | ❌ Unused |

#### Content Optimization Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `readabilityScore` | Decimal? | Readability score | ❌ Unused |
| `keywordOptimization` | Json? | Keyword optimization data | ❌ Unused |
| `toneAnalysis` | Json? | Tone and sentiment analysis | ❌ Unused |

#### Usage & Analytics Fields
| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `copyCount` | Int | How many times content was copied | ❌ Unused |
| `lastCopiedAt` | DateTime? | Last time content was copied | ❌ Unused |

---

### 6. FeatureUsage Model - Unused Fields (4 fields)

| Field Name | Type | Description | Usage Status |
|------------|------|-------------|--------------|
| `totalTimeSpent` | Int | Total time spent in minutes | ❌ Unused |
| `averageSessionTime` | Int? | Average session time in minutes | ❌ Unused |
| `successRate` | Decimal? | Success rate percentage | ❌ Unused |
| `satisfactionScore` | Decimal? | Satisfaction score | ❌ Unused |

---

## 🗑️ Completely Unused Models (11 models)

| Model Name | Description | Usage Status |
|------------|-------------|--------------|
| `MarketTrends` | Market trends data | ❌ 100% Unused |
| `PerformanceMetrics` | Performance monitoring | ❌ 100% Unused |
| `ArchivedCvData` | Archived CV data | ❌ 100% Unused |
| `ArchivedJobData` | Archived job data | ❌ 100% Unused |
| `SchemaVersion` | Schema version tracking | ❌ 100% Unused |
| `PasswordResetToken` | Password reset tokens | ❌ 100% Unused |
| `AuthProvider` | Authentication providers | ❌ 100% Unused |
| `UserAuthMethod` | User authentication methods | ❌ 100% Unused |
| `UserNotification` | User notifications | ❌ 100% Unused |
| `ContactMessage` | Contact messages | ❌ 100% Unused |
| `Newsletter` | Newsletter subscriptions | ❌ 100% Unused |

