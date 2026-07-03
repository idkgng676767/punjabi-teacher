# PunjabiLingo — Complete Product Blueprint (Part 3 of 4)
## Sections 8–9: Technical Architecture & UI/UX Design System

---

## 8. Technical Architecture

### 8.1 System Architecture Overview

```
CLIENT LAYER
├── iOS App (Flutter)
├── Android App (Flutter)
└── Web App (React, PWA)

API GATEWAY
├── Kong / AWS API Gateway
├── Rate Limiting, Auth, SSL

MICROSERVICES
├── User Service
├── Lesson Service
├── Progress Service
├── Community Service
├── Speech Service
├── Writing Service
├── Content Service
├── Notification Service
├── Payment Service
├── Analytics Service
├── Gamify Service
└── Search Service

DATA LAYER
├── PostgreSQL (Users, Payments)
├── Redis (Sessions, Cache)
├── MongoDB (Content, Analytics)
├── S3 / CloudFront (Media)
├── Elasticsearch (Search)
└── ClickHouse (Analytics)

AI/ML SERVICES
├── Speech-to-Text (Whisper)
├── Handwriting Recognition (TensorFlow)
├── Tone Analysis (Custom ML)
├── Translation (NLLB-200)
├── Content Recommendation
└── Personalized Learning Path
```

### 8.2 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Mobile** | Flutter | Single codebase for iOS/Android, fast UI, great for animations |
| **Web** | React + Next.js | SEO-friendly, fast loads, PWA capabilities |
| **Backend** | Node.js (NestJS) | JavaScript ecosystem, fast development, good for real-time |
| **Database** | PostgreSQL | Relational data, ACID compliance, JSON support |
| **Cache** | Redis | Sessions, leaderboards, real-time features |
| **Queue** | RabbitMQ / AWS SQS | Async processing, decoupled services |
| **Search** | Elasticsearch | Fast content search, typo tolerance |
| **Storage** | AWS S3 + CloudFront | CDN for audio/images, global delivery |
| **Auth** | Firebase Auth / Auth0 | Social login, phone auth (important for India) |
| **Analytics** | Amplitude + ClickHouse | User behavior, funnel analysis |
| **Monitoring** | Datadog / Sentry | Error tracking, performance monitoring |

### 8.3 AI/ML Components

#### Speech Recognition & Scoring
```
INPUT: User audio (3-5 seconds)
  |
  ├── Preprocessing: Noise reduction, normalization
  ├── Speech-to-Text: OpenAI Whisper (multilingual, Punjabi support)
  ├── Phoneme Alignment: Montreal Forced Aligner
  ├── Tone Analysis: Custom pitch extraction model
  |   └── Extract F0 contour, classify tone (low/mid/high)
  ├── Scoring Algorithm:
  |   ├── Accuracy: Word error rate (WER)
  |   ├── Pronunciation: Phoneme distance from native
  |   ├── Tone: Pitch contour similarity (DTW algorithm)
  |   └── Fluency: Speaking rate, pause patterns
  └── OUTPUT: Score (0-100) + Feedback + Visualization
```

#### Handwriting Recognition
```
INPUT: User handwriting stroke data (x, y, timestamp, pressure)
  |
  ├── Preprocessing: Normalize size, smooth strokes
  ├── Feature Extraction: Stroke direction, curvature, intersections
  ├── Model: CNN-LSTM hybrid trained on Gurmukhi dataset
  |   └── Dataset: 50K+ labeled Gurmukhi character samples
  ├── Scoring:
  |   ├── Shape accuracy: IoU with reference
  |   ├── Stroke order: Correct sequence check
  |   ├── Proportion: Size and placement
  |   └── Connection: Proper joining for conjuncts
  └── OUTPUT: Character recognition + Quality score + Correction hints
```

#### Content Recommendation
```
INPUT: User behavior (lessons completed, errors, time spent, interests)
  |
  ├── Feature Engineering:
  |   ├── Skill proficiency vector (per topic)
  |   ├── Learning style (visual, auditory, kinesthetic)
  |   ├── Engagement pattern (morning/evening, session length)
  |   └── Cultural interest flags
  ├── Model: Collaborative filtering + Content-based hybrid
  ├── Output:
  |   ├── Next lesson recommendation
  |   ├── Difficulty adjustment
  |   ├── Review word selection (spaced repetition)
  |   └── Cultural content suggestions
  └── FEEDBACK LOOP: A/B test recommendations, optimize for retention
```

### 8.4 Offline Architecture

**Critical for Rural Punjab & Low-Bandwidth Users:**

```
OFFLINE CAPABILITIES:
├── Download lesson packs (50-100MB per unit)
├── Cached audio for all downloaded content
├── Offline handwriting recognition (on-device model)
├── Offline speech recognition (lightweight model)
├── Progress syncs when connection restored
└── Queue system: Upload practice data in background

SYNC STRATEGY:
├── Conflict resolution: Server wins for progress, client wins for preferences
├── Background sync: Every 15 minutes when online
├── Manual sync: Pull-to-refresh on profile
└── Data compression: Protocol Buffers for efficient transfer
```

### 8.5 Infrastructure & DevOps

| Component | Solution |
|-----------|----------|
| **Cloud Provider** | AWS (primary) + Cloudflare (CDN) |
| **Container Orchestration** | Kubernetes (EKS) |
| **CI/CD** | GitHub Actions to Docker to ECR to EKS |
| **Infrastructure as Code** | Terraform |
| **Monitoring** | Prometheus + Grafana + Datadog |
| **Logging** | ELK Stack (Elasticsearch, Logstash, Kibana) |
| **Alerting** | PagerDuty |
| **Security** | OWASP Top 10 compliance, regular penetration testing |

### 8.6 Scalability Plan

| Phase | Users | Infrastructure |
|-------|-------|----------------|
| MVP | 1K-10K | Single EC2 + RDS, Cloudflare CDN |
| Growth | 10K-100K | Auto-scaling ECS, read replicas, Redis cluster |
| Scale | 100K-1M | Kubernetes, sharded databases, multi-region CDN |
| Global | 1M+ | Multi-region deployment (India, UK, Canada), edge computing |

---

## 9. UI/UX Design System

### 9.1 Design Principles

1. **Warm & Welcoming:** Punjab is warm, the app should feel like a hug from Biji
2. **Culturally Authentic:** Not generic "language app" — distinctly Punjabi
3. **Accessible:** Works for 8-year-olds and 80-year-olds, all vision abilities
4. **Playful but Respectful:** Fun with the language, respectful of the culture
5. **Progressive Disclosure:** Don't overwhelm beginners, reveal depth over time

### 9.2 Color System

```
PRIMARY PALETTE:
├── Saffron (#FF9933): Primary actions, CTAs, highlights
├── Emerald (#138808): Success states, progress, nature themes
├── Royal Blue (#000080): Links, secondary actions, depth
├── Cream (#FFF8E7): Backgrounds, cards, warmth
└── Charcoal (#2D2D2D): Text, strong contrast

SECONDARY PALETTE:
├── Wheat (#F5DEB3): Farm/field themes
├── Turmeric (#FFC107): Warnings, achievements
├── Rose (#E91E63): Hearts, streaks, love
├── Sky (#87CEEB): Water, calm, meditation
└── Gold (#FFD700): Premium, special items

SEMANTIC COLORS:
├── Success: Emerald (#138808)
├── Error: Crimson (#DC143C)
├── Warning: Turmeric (#FFC107)
├── Info: Royal Blue (#000080)
└── Neutral: Gray (#9E9E9E)
```

### 9.3 Typography

```
LATIN TEXT:
├── Display: Poppins Bold (headlines, large text)
├── Body: Poppins Regular (paragraphs, descriptions)
├── Mono: JetBrains Mono (code, phonetic transcription)
└── Accent: Dancing Script (celebrations, special moments)

GURMUKHI TEXT:
├── Display: Noto Sans Gurmukhi Bold
├── Body: Noto Sans Gurmukhi Regular
└── Fallback: Arial Unicode MS

SHAHMUKHI TEXT:
├── Display: Noto Nastaliq Urdu
├── Body: Noto Nastaliq Urdu
└── Fallback: Jameel Noori Nastaleeq

TYPE SCALE:
├── Hero: 32px / Bold (Welcome screens)
├── H1: 24px / Bold (Section headers)
├── H2: 20px / SemiBold (Card titles)
├── H3: 16px / SemiBold (Subsection)
├── Body: 14px / Regular (Main text)
├── Caption: 12px / Regular (Labels, hints)
└── Micro: 10px / Medium (Badges, timestamps)
```

### 9.4 Component Library

**Core Components:**

```
BUTTONS:
├── Primary (Saffron, rounded, shadow)
├── Secondary (Outlined, cream bg)
├── Ghost (Text only, for subtle actions)
├── Icon Button (Circular, for tools)
└── Floating Action Button (Mittu mascot)

CARDS:
├── Lesson Card (Progress ring, lock state)
├── Word Card (Gurmukhi + image + audio)
├── Achievement Card (Badge + description)
└── Story Card (Illustration + chapter preview)

INPUT FIELDS:
├── Text Input (Gurmukhi keyboard toggle)
├── Voice Input (Hold to speak, waveform)
├── Handwriting Canvas (Dotted grid, stroke tracking)
└── Multiple Choice (Large touch targets, haptic feedback)

FEEDBACK:
├── Toast (Success: green, Error: red)
├── Modal (Achievements, confirmations)
├── Bottom Sheet (Options, filters)
└── Confetti (Lesson complete, streak milestones)

NAVIGATION:
├── Bottom Tab Bar (5 items: Learn, Practice, Village, Leaderboard, Profile)
├── Top App Bar (Contextual actions)
├── Skill Tree (Scrollable, zoomable map)
└── Breadcrumbs (Story mode navigation)

GAMIFICATION:
├── XP Bar (Animated fill)
├── Streak Flame (Animated, pulsing)
├── Heart System (Animated break/fill)
├── Leaderboard Row (Rank, avatar, score)
└── Village Builder (Isometric grid, drag-and-drop)
```

### 9.5 Key Screens

#### Onboarding Flow

**Screen 1: Welcome**
- Full-screen illustration: Punjab landscape
- "Learn Punjabi. Love the Culture."
- "Get Started" button (Saffron, large)
- "I already have an account" link

**Screen 2: Goal Selection**
- "Why are you learning Punjabi?"
- Options:
  - "Connect with family" (grandparents icon)
  - "Travel to Punjab" (airplane icon)
  - "Understand culture" (Bhangra icon)
  - "Read Gurbani" (Guru Granth Sahib icon)
  - "Just for fun" (Mittu icon)
- Multi-select, user can choose 1-3

**Screen 3: Script Choice**
- "Which script do you want to learn?"
- Option A: Gurmukhi (Indian Punjabi) — Preview: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ"
- Option B: Shahmukhi (Pakistani Punjabi) — Preview: "ست سری اکال"
- Option C: Both (advanced toggle)
- "I don't know" -> Recommend Gurmukhi

**Screen 4: Proficiency Test**
- "Let's find your level"
- 5 quick questions: Recognize letter, audio meaning, sentence arrangement, pronunciation
- Result: "You're a Beginner!" or "Start at Chapter 3"

**Screen 5: Daily Goal**
- "How much time can you practice?"
- Slider: 5 min to 20 min
- "Start Learning!" -> Main app

#### Main Learning Screen Layout
```
Top Bar:    Fire 12  Gems 45  Hearts 5/5    [Profile]

Village Preview:
    [House icon]  Kothi (Level 3)
    [Tree icons]

Continue Learning Card:
    Chapter 2: Family
    Lesson 4 of 8
    [Continue Button]

Skill Tree (scrollable):
    [Hello] [Food] [Family] [Travel]
    [Work]  [Music] [Wedding] [Gurbani]
    (Locked items grayed out)

Bottom Nav:
    [Learn] [Practice] [Village] [Leaderboard] [Profile]
```

#### Lesson Screen Layout
```
Top: Back  3/8  Hearts 5

"Translate this:"

[Card: ਸਤ ਸ੍ਰੀ ਅਕਾਲ]
[Play Audio Button]

[Option: Hello]
[Option: Good morning]
[Option: Goodbye]

[CHECK Button]

Tools: [Hint] [Report] [Slow Audio]
```

#### Handwriting Practice Screen
```
Top: Back  Write: ਓ

[Canvas with dotted grid]
[Reference letter ghosted]
[User stroke drawn]

[Clear] [Show Stroke Order]

Feedback: "Great shape! Try making the top line straighter."

[NEXT Button]
```

#### Voice Practice Screen
```
Top: Back  Pronounce: "ਕੋੜਾ"

[Hold to Speak Button]
[Waveform animation]

Native Speaker Pitch Curve:
[Visual waveform comparison]

Your Attempt Pitch Curve:
[Visual waveform comparison]

Score: 78/100  Tone: High correct, Low incorrect
Tip: "Raise your pitch at the end"

[TRY AGAIN] [NEXT]
```

### 9.6 Animation & Motion

| Interaction | Animation |
|-------------|-----------|
| Lesson complete | Confetti burst + Mittu flies across screen |
| Correct answer | Green flash + subtle bounce + pleasant chime |
| Wrong answer | Gentle shake + red tint + soft buzz |
| Streak milestone | Flame grows + golden glow + special sound |
| New badge | Badge spins in + spotlight effect + drumroll |
| XP gain | Numbers float up + progress bar fills |
| Heart loss | Heart cracks + sad Mittu reaction |
| Village building | Building assembles block-by-block + fireworks |
| Level up | Screen flash + new color theme preview |

### 9.7 Sound Design

| Event | Sound |
|-------|-------|
| App open | Gentle dhol beat + "Balle Balle!" |
| Correct answer | Pleasant tumbi (single string instrument) note |
| Wrong answer | Soft dholak (drum) thud |
| Lesson complete | Short Bhangra music clip + applause |
| Streak milestone | Full dhol roll + crowd cheer |
| Badge earned | Trumpet fanfare |
| Level up | Rising shehnai melody |
| Heart refill | Gentle water pour sound |
| Button tap | Subtle wooden click |
| Scroll | Soft whoosh |

**Voice Talent:**
- Male voice: Warm, elder-like (for formal/cultural content)
- Female voice: Friendly, peer-like (for casual conversation)
- Child voice: For family/children vocabulary
- Regional accents: Majhi standard, with occasional Malwai/Doabi samples

---
*End of Part 3 — Continue to Part 4 for Content Strategy, Monetization, Marketing, Roadmap, Team, Budget, Risks, KPIs, and Appendices*
