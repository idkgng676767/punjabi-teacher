# Punjabi Teacher

An AI-powered app for learning to write and speak Punjabi (Gurmukhi).

Built with an agentic AI system — LLM, TTS, and STT — that guides beginners through the 35 Akhar (Gurmukhi alphabet) with Duolingo-style interactive lessons.

---

## Features

- **One Level:** Learn the complete Gurmukhi alphabet
- **Agentic AI Tutor:** Speaks Punjabi, listens to your pronunciation, corrects your writing
- **Interactive Lessons:** Trace, draw, recognize, and spell letters
- **Voice-First:** Speech-to-text for speaking practice, text-to-speech for hearing correct pronunciation
- **Progress Tracking:** Streaks, XP, and mastery badges

## Tech Stack

| Component | Choice |
|-----------|--------|
| Framework | Next.js 14 (App Router) + TypeScript |
| LLM | Ollama (local) or Gemini 2.5 Flash (cloud) |
| TTS | **ElevenLabs Eleven v3** — Voice: "Pind Punjabi - Energetic and Encouraging" |
| STT | OpenAI Whisper API or whisper.cpp |
| Styling | Tailwind CSS + shadcn/ui |
| Drawing | HTML5 Canvas + Perfect Freehand |
| State | React context + LocalStorage |

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
punjabi-teacher/
├── app/                    # Next.js app router
│   ├── lesson/            # Interactive lesson page
│   └── api/               # API routes for AI services
├── components/            # React components (Canvas, Lesson, Agent)
├── lib/                   # Utilities, AI clients
├── types/                 # TypeScript types
└── public/               # Assets, audio files
```

## License

MIT
