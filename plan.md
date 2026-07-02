# Punjabi Teacher - Implementation Plan

> **Goal:** Build a Duolingo-style app for learning the Gurmukhi (Punjabi) alphabet, powered by an agentic AI tutor with TTS, STT, and LLM.

---

## Architecture Overview

Single-page Next.js app with a conversational AI tutor that guides users through 35 Gurmukhi letters using voice and drawing interactions.

```
User <-> Next.js Frontend <-> Agent Orchestrator <-> LLM / TTS / STT
```

---

## Tech Stack

| Component | Choice |
|-----------|--------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Drawing | HTML5 Canvas + Perfect Freehand |
| LLM | Gemini 2.5 Flash (API) or Ollama (local) |
| TTS | edge-tts (pa-IN voice) |
| STT | OpenAI Whisper API or whisper.cpp |
| State | React context + LocalStorage |
| Icons | Lucide React |

---

## Data Model

### Letter
```typescript
interface Letter {
  character: string;      // e.g., "ਕ"
  name: string;           // e.g., "kakka"
  pronunciation: string; // e.g., "ka"
  order: number;          // 1-35
  group: string;          // e.g., "ਕਵ","ਚਵ","ਟਵ" groups
}
```

### LessonState
```typescript
interface LessonState {
  currentLetterIndex: number;
  streak: number;
  xp: number;
  masteredLetters: string[];
  currentStage: 'learn' | 'recognize' | 'write' | 'spell' | 'quiz';
  attempts: number;
}
```

### UserProgress
```typescript
interface UserProgress {
  lettersMastered: string[];
  totalXP: number;
  currentStreak: number;
  lastSessionDate: string;
}
```

---

## Lesson Flow (Per Letter Group)

### Stage 1: Learn
- AI speaks letter name in Punjabi (TTS)
- Display large letter with stroke order animation
- User traces letter on canvas
- AI confirms correctness

### Stage 2: Recognize
- AI speaks letter name
- User picks correct letter from 4 options
- Immediate feedback

### Stage 3: Write
- AI speaks letter name
- User draws letter freehand on canvas
- Basic shape matching (simple heuristic or LLM vision)

### Stage 4: Spell
- AI speaks a simple word using learned letters
- User writes each letter
- Build words letter by letter

### Stage 5: Quiz
- Mix of recognition and writing for all letters in group
- Must get 80% to unlock next group

---

## Agentic AI Flow

```
User Action (voice/draw/click)
    |
  STT (if voice) -> text
    |
  Agent evaluates input against expected answer
    |
  |-- Correct  -> Encouragement + Progress + Next challenge
  |-- Close    -> Gentle correction + Retry same
  |-- Wrong    -> Explain + Show correct + Easier retry
    |
  LLM generates response (Punjabi + English mix)
    |
  TTS speaks response
    |
  Update UI (animations, progress, next state)
```

### LLM System Prompt

```
You are a friendly, encouraging Punjabi writing tutor for absolute beginners. 
Your student is learning the Gurmukhi alphabet.

Rules:
- Speak Punjabi for letter names and simple words
- Explain in short, clear English sentences
- Be encouraging like Duolingo ("Great job!", "Almost! Try again.")
- If wrong: show correct letter, explain briefly, encourage retry
- Keep responses under 2 sentences when possible
- Use Gurmukhi script for letter examples

Current lesson context will be provided.
```

---

## File Structure

```
punjabi-teacher/
├── app/
│   ├── page.tsx                    # Main app entry (lesson screen)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Tailwind + custom styles
│   └── api/
│       ├── chat/route.ts           # LLM API route
│       ├── tts/route.ts            # TTS API route (edge-tts)
│       └── stt/route.ts            # STT API route (Whisper)
├── components/
│   ├── LessonScreen.tsx            # Main lesson container
│   ├── LetterCanvas.tsx            # Drawing canvas component
│   ├── LetterOptions.tsx           # Multiple choice grid
│   ├── AgentAvatar.tsx             # Animated AI tutor face
│   ├── ProgressBar.tsx             # XP and streak display
│   ├── AudioPlayer.tsx             # TTS playback
│   └── VoiceInput.tsx              # STT microphone input
├── lib/
│   ├── letters.ts                  # 35 Akhar data + groups
│   ├── agent.ts                    # Agent orchestrator logic
│   ├── llm.ts                      # LLM client (Gemini/Ollama)
│   ├── tts.ts                      # TTS client wrapper
│   ├── stt.ts                      # STT client wrapper
│   └── storage.ts                  # LocalStorage helpers
├── types/
│   └── index.ts                    # TypeScript interfaces
├── public/
│   └── audio/                      # Cached TTS audio files
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## Implementation Tasks

### Task 1: Project Setup
- Scaffold Next.js 14 with shadcn
- Install dependencies: canvas, perfect-freehand, lucide-react
- Configure Tailwind
- Verify git repo setup

### Task 2: Data Layer
- Define `Letter` interface
- Create `letters.ts` with all 35 Akhar
- Group letters into 5-7 letter groups
- Create `storage.ts` for LocalStorage CRUD

### Task 3: Basic UI Shell
- Create `LessonScreen` layout
- Add progress bar, XP counter, streak display
- Add agent avatar placeholder

### Task 4: Drawing Canvas
- Implement `LetterCanvas` with HTML5 Canvas
- Add touch/mouse drawing
- Add stroke visualization
- Test on mobile

### Task 5: TTS Integration
- Create `/api/tts` route using edge-tts
- Cache audio files to `public/audio/`
- Create `AudioPlayer` component for playback
- Test Punjabi pronunciation (pa-IN)

### Task 6: STT Integration
- Create `/api/stt` route using Whisper
- Create `VoiceInput` component with mic button
- Test Punjabi speech recognition

### Task 7: LLM + Agent
- Create `/api/chat` route (Gemini 2.5 Flash)
- Build `agent.ts` orchestrator
- Implement evaluation logic (correct/close/wrong)
- Connect TTS to speak agent responses

### Task 8: Lesson Flow
- Wire up stages: Learn -> Recognize -> Write -> Spell -> Quiz
- Implement state machine for lesson progression
- Add animations (framer-motion)

### Task 9: Polish
- Add sound effects
- Add confetti on mastery
- Mobile responsiveness
- Loading states

### Task 10: Deploy
- Build for production
- Deploy to Vercel or self-host
- Test end-to-end

---

## Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| TTS Punjabi quality poor | Test edge-tts pa-IN early; fallback to Google TTS |
| STT accuracy low for Punjabi | Use Whisper large-v3; allow text input fallback |
| Canvas drawing clunky on mobile | Test thoroughly; add palm rejection |
| LLM latency too high | Use Gemini Flash; cache common responses |
| Free API limits | Implement rate limiting; prepare local fallback |

## Open Questions

1. Should we use Ollama locally or stick to Gemini API for MVP?
2. Do we need user accounts or is local storage enough for v1?
3. Should writing validation use simple heuristics or a vision LLM?

---

## Success Criteria

- [ ] User can complete lesson for first 5 letters
- [ ] Agent speaks Punjabi clearly (TTS)
- [ ] User can draw letters and get feedback
- [ ] App works on mobile browsers
- [ ] Progress persists across sessions
