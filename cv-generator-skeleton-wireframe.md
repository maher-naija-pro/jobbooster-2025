# CV Generator Skeleton Loading Wireframe

## Current State Analysis
The current CV generator shows a basic loading state with:
- Progress bar (18% Complete)
- Simple text: "AI is analyzing your CV and matching it against job requirements"
- Purple dot with "Generating..." text

## Actual CV Analysis Results Structure
Based on the real interface, the CV Analysis Results page contains:
- Header with success notification and view toggle
- Overall Match Score card (80% with progress bar)
- Three summary cards (Perfect Matches, Missing Skills, Strengths)
- Technical Skills Analysis table
- Soft Skills Analysis table  
- Key Recommendations section

## Proposed Skeleton Loading Design

### Layout Structure
```
┌─────────────────────────────────────────────────────────────────┐
│                    CV Analysis Skeleton Loading                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │

│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Overall Match Score Card (Skeleton)                   │   │
│  │  🎯 Overall Match Score                                │   │
│  │  ██%  ████████████████████████████████████████████████  │   │
│  │  ████████████████████████████████████████████████████   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Summary Cards Skeleton                                 │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐       │   │
│  │  │ ✓ ████████  │ │ ⚠ ████████  │ │ ⭐ ████████  │       │   │
│  │  │ ███████████ │ │ ███████████ │ │ ███████████ │       │   │
│  │  │ ███████████ │ │ ███████████ │ │ ███████████ │       │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Technical Skills Table Skeleton                       │   │
│  │  ████████████████████████████████████████████████████   │   │
│  │  ┌─────────┬─────────┬─────────┬─────────┬─────────┐   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  ├─────────┼─────────┼─────────┼─────────┼─────────┤   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  ├─────────┼─────────┼─────────┼─────────┼─────────┤   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  └─────────┴─────────┴─────────┴─────────┴─────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Soft Skills Table Skeleton                             │   │
│  │  ████████████████████████████████████████████████████   │   │
│  │  ┌─────────┬─────────┬─────────┬─────────┬─────────┐   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  ├─────────┼─────────┼─────────┼─────────┼─────────┤   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  ├─────────┼─────────┼─────────┼─────────┼─────────┤   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │   │   │
│  │  └─────────┴─────────┴─────────┴─────────┴─────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Key Recommendations Skeleton                           │   │
│  │  💡 Key Recommendations                                 │   │
│  │  • ████████████████████████████████████████████████████ │   │
│  │  • ████████████████████████████████████████████████████ │   │
│  │  • ████████████████████████████████████████████████████ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Detailed Skeleton Components

### 1. CV Analysis Progress Card
- **Title**: "Analyzing CV" (bold, dark grey text, top left)
- **Progress Bar**: Horizontal bar with light grey track and dark grey fill 
- **Description**: "AI is analyzing your CV and matching it against job requirements" (light grey text)
- **Status Indicator**: Purple circular dot with "Generating..." text (top right)
- **Completion**: "x% Complete" in blue text (bottom right)
- **Container**: White card with rounded corners and subtle drop shadow
- **Layout**: Centered on page with proper spacing

### 2. Header Skeleton
- Success notification with checkmark icon
- "CV Analysis Generated Successfully" text
- Copy button placeholder
- Word count and read time placeholders
- View mode toggle buttons (Compact/Detailed)

### 3. Overall Match Score Card Skeleton
- Target icon placeholder
- "Overall Match Score" title
- Large percentage placeholder (e.g., "██%")
- Animated progress bar (purple gradient)
- Status text placeholder (e.g., "Excellent match!")

### 4. Summary Cards Skeleton (3 cards)
- **Perfect Matches Card:**
  - Green checkmark icon
  - "Perfect Matches" title
  - Number placeholder (e.g., "3")
  - Green background with border
- **Missing Skills Card:**
  - Yellow warning triangle icon
  - "Missing Skills" title
  - Number placeholder (e.g., "2")
  - Yellow background with border
- **Strengths Card:**
  - Blue star icon
  - "Strengths" title
  - Number placeholder (e.g., "2")
  - Blue background with border

### 5. Technical Skills Table Skeleton
- Section title: "Technical Skills Analysis"
- Table with 5 columns:
  - Skill Name
  - Job Required
  - CV Level
  - Match
  - Status
- 3-5 data rows with placeholder content
- Each cell contains appropriate icon and text placeholders
- Color-coded rows based on match status

### 6. Soft Skills Table Skeleton
- Section title: "Soft Skills Analysis"
- Identical structure to Technical Skills table
- Blue background theme
- Same 5-column layout with placeholder data

### 7. Key Recommendations Skeleton
- Lightbulb icon placeholder
- "Key Recommendations" title
- Purple background theme
- 2-3 bullet point items with text placeholders
- Each item represents a specific recommendation

## Loading Sequence States

### Phase 1: Initial Loading (0-20%)
```
┌─────────────────────────────────────────────────────────────────┐
│  [🔄] Analyzing CV...                                          │
│  ████████████████████████████████████████████████████████████   │
│  AI is analyzing your CV and matching it against job requirements│
│  18% Complete                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 1.5: CV Analysis Progress Card (0-20%)
```
┌─────────────────────────────────────────────────────────────────┐
│                    CV Analysis Progress Card                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Analyzing CV                    ● Generating...        │   │
│  │  ████████████████████████████████████████████████████   │   │
│  │  AI is analyzing your CV and matching it against job    │   │
│  │  requirements                                            │   │
│  │                                           4% Complete   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 2: Skeleton Structure (20-60%)
```
┌─────────────────────────────────────────────────────────────────┐
│  [✓] ████████████████████████████████████████████ [Copy]       │
│  ████████████████████████████████████████████████████████       │
│  [Compact] [Detailed]                                           │
│                                                                 │
│  🎯 Overall Match Score                                         │
│  ██%  ████████████████████████████████████████████████████████  │
│  ████████████████████████████████████████████████████████████   │
│                                                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │ ✓ ████████  │ │ ⚠ ████████  │ │ ⭐ ████████  │               │
│  │ ███████████ │ │ ███████████ │ │ ███████████ │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 3: Table Structure (60-90%)
```
┌─────────────────────────────────────────────────────────────────┐
│  Technical Skills Analysis                                      │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐           │
│  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │           │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┤           │
│  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │           │
│  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │           │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘           │
│                                                                 │
│  Soft Skills Analysis                                           │
│  ┌─────────┬─────────┬─────────┬─────────┬─────────┐           │
│  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │           │
│  ├─────────┼─────────┼─────────┼─────────┼─────────┤           │
│  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │           │
│  │ ███████ │ ███████ │ ███████ │ ███████ │ ███████ │           │
│  └─────────┴─────────┴─────────┴─────────┴─────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

### Phase 4: Final Details (90-100%)
```
┌─────────────────────────────────────────────────────────────────┐
│  💡 Key Recommendations                                         │
│  • ████████████████████████████████████████████████████████████ │
│  • ████████████████████████████████████████████████████████████ │
│  • ████████████████████████████████████████████████████████████ │
│                                                                 │
│  ████████████████████████████████████████████████████████████   │
│  0 words • 0 min read                                           │
└─────────────────────────────────────────────────────────────────┘
```

## Animation Details
- **Shimmer Effect**: Left-to-right gradient animation
- **Duration**: 1.5s infinite loop
- **Easing**: ease-in-out
- **Colors**: Gray-200 → Gray-100 → Gray-200
- **Pulse Effect**: Subtle scale animation (1.0 → 1.02 → 1.0)
- **Staggered Loading**: Each section appears with 200ms delay

## Responsive Behavior
- **Mobile**: Single column layout, stacked cards
- **Tablet**: 2-column layout for summary cards
- **Desktop**: 3-column layout for summary cards
- **Table**: Horizontal scroll on mobile with sticky header

## Implementation Notes
- Use CSS animations for shimmer effect
- Maintain aspect ratios for consistent loading appearance
- Include proper accessibility attributes (aria-labels, role="progressbar")
- Ensure skeleton matches actual content structure exactly
- Add subtle pulsing animation for active elements
- Use CSS Grid/Flexbox for responsive layout
- Implement progressive disclosure (sections appear in sequence)
- Add loading state management with proper cleanup
