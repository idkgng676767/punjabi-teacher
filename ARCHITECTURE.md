# PunjabiLingo Mobile App Architecture (React Native)

## 1. Overview
This document outlines the technical architecture for the PunjabiLingo mobile application built with React Native. The app follows a modular, scalable design that aligns with the backend microservices outlined in the overall product blueprint (see `plan_part3.md`). The mobile layer handles UI, local state, offline caching, and integration with device capabilities (audio, handwriting, sensors) while delegating heavy computation (AI/ML, content recommendation) to backend services.

## 2. Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **Framework** | React Native (Expo managed workflow) | Rapid development, OTA updates, access to native modules via Expo SDK, easy iOS/Android builds. |
| **Language** | TypeScript | Type safety, autocompletion, refactoring safety. |
| **State Management** | Zustand (global state) + React Query (server state) | Minimal boilerplate, excellent DevTools, built‑in caching & background updates. |
| **Navigation** | React Navigation v6 (Native Stack & Bottom Tabs) | Performant, widely used, supports deep linking. |
| **UI Components** | Custom design system based on React Native Paper / custom components | Consistent Punjabi‑themed UI, accessibility, theming (light/dark). |
| **Local Storage** | MMKV (via `@mmkv/react-native`) for high‑performance key‑value; SQLite (via `expo-sqlite`) for structured lesson/content caching. |
| **Asset Management** | Expo Asset + Expo AssetUtils; images/audio bundled or fetched via CDN (CloudFront). |
| **Networking** | Axios (with interceptors for auth, logging, retry) + React Query for data fetching. |
| **Authentication** | Expo AuthSession + custom JWT backend (NestJS) or Firebase Auth (phone/social). |
| **Push Notifications** | Expo Notifications (FCM/APNs). |
| **Speech Input** | `expo-av` for recording + `expo-speech` for playback; optional `react-native-voice` for streaming STT. |
| **Handwriting Input** | `react-native-gesture-handler` + `react-native-gesture-handler` canvas + custom painter; or `@react-native-community/canvas`. For offline recognition, bundle a TensorFlow Lite model (see AI/ML section). |
| **Analytics** | Expo Firebase / Segment / Amplitude integration. |
| **Error Monitoring** | Sentry (expo-sentry). |
| **CI/CD** | GitHub Actions → EAS Build (Expo) → EAS Submit (App Store/Play Store) → OTA updates via Expo. |
| **Testing** | Jest + React Native Testing Library (unit/component), Detox (end‑to‑end), ESLint + Prettier. |

## 3. High‑Level Architecture

```
+-------------------+       +---------------------+       +-----------------------+
|   Mobile App      | <---> |   API Gateway (Kong | <---> |   Microservices       |
| (React Native)    |       |   / AWS APIGW)      |       |   - User Service      |
|                   |       |                     |       |   - Lesson Service    |
|  - UI Layer       |       |                     |       |   - Progress Service  |
|  - State Layer    |       |                     |       |   - Speech Service    |
|  - Offline Layer  |       |                     |       |   - Writing Service   |
|  - Native Bridge  |       |                     |       |   - Content Service   |
|                   |       +---------------------+       |   - Gamify Service    |
+-------------------+                                   |   - etc.                |
                                                        +-----------------------+
```

### 3.1 Layers

#### Presentation Layer
- **Screens** organized by feature (Learn, Practice, Village, Leaderboard, Profile).
- **Components**: reusable UI atoms (Button, Card, Input, Avatar) built with React Native Paper and custom styling.
- **Navigation**: Bottom tab navigator (5 tabs) + nested stacks for deep links (e.g., lesson detail, story mode).
- **Theming**: Central theme file exposing Punjabi color palette, typography (Poppins, Noto Sans Gurmukhi/Shahmukhi), and dark mode support.

#### State Management Layer
- **Zustand stores**:
  - `userStore`: auth token, profile, settings.
  - `villageStore`: village buildings, coins/gems, decorations.
  - `uiStore`: loading states, modal visibility, snackbars.
- **React Query**:
  - Queries: `useLessons`, `useProgress`, `useLeaderboard`, `useContent`.
  - Mutations: `submitLesson`, `updateProfile`, `purchaseItem`.
  - Automatic background refetching, stale‑while‑revalidate, optimistic updates.

#### Data Persistence Layer
- **MMKV**: JWT token, user preferences, feature flags, offline queue.
- **SQLite** (via `expo-sqlite`):
  - Tables: `lessons`, `vocab`, `progress`, `offline_actions`.
  - Sync strategy: when online, push queued actions to backend; pull latest content version based on ETag/version.

#### Service Layer (Native Modules)
- **Audio**: `expo-av` for recording user pronunciation; `expo-speech` for playback of native audio.
- **Handwriting**: Custom canvas capturing touch points; optional TensorFlow Lite model for on‑device character classification (fallback to backend if unavailable).
- **Sensors**: Device orientation for certain mini‑games (optional).
- **Permissions**: Permissions handled via `expo-permissions`.

#### Integration Layer
- **API Client**: Axios instance with base URL from env, automatic token refresh, error transformation to UI‑friendly messages.
- **WebSocket** (optional): For real‑time features (live challenges, village updates) using Socket.io client.

#### AI/ML Integration
- **Speech Scoring**: Audio sent to backend `Speech Service` (Whisper + custom tone model) → returns score & feedback.
- **Handwriting Recognition**: 
  - Online: send stroke data to `Writing Service` (CNN‑LSTM model) → returns character + quality score.
  - Offline (optional): bundled TensorFlow Lite model for basic character recognition; confidence < threshold triggers online call.
- **Content Recommendation**: Periodic fetch from `Recommendation Service` (via React Query) → updates suggested lessons/review cards.

## 4. Data Flow Examples

### 4.1 Lesson Flow
1. User taps a lesson → navigation to `LessonScreen`.
2. `useLessonQuery(lessonId)` fetches lesson metadata (cached, stale‑while‑revalidate).
3. Audio assets pre‑fetched via `expo-asset`; stored in cache.
4. User interacts:
   - **Multiple Choice**: optimistic update via `mutateAsync` (update progress locally, push to background queue).
   - **Speaking**: record audio → upload to `/speech/score` → receive score → update progress.
   - **Handwriting**: capture strokes → send to `/writing/recognize` → get feedback → update progress.
5. On lesson complete, show confetti animation (via `react-native-confetti`) and grant XP/gems (optimistic update, then sync).

### 4.2 Village Builder
- Drag‑and‑drop using `react-native-gesture-handler`.
- Placement action dispatched to `villageStore` (optimistic) and queued for server sync.
- Server validates placement, returns updated village state → reconcile with store.

### 4.3 Offline‑First
- On app start, check network.
- If offline:
  - Load lessons/content from SQLite.
  - Allow completion of downloaded lessons.
  - Store user actions in MMKV queue.
- On reconnect:
  - Flush queue via batch POST to `/offline/sync`.
  -sync`.
  - Pull any new ETag.

## 5. Security & Privacy: only anonymized progress data sent unless user opts in.

## 5. Performance Considerations
- **Startup**: Use Expo splash screen with lazy loading of feature modules via `react-native-loading-spinner-overlay` until essential bundles load.
- **Image/Audio**: Serve appropriately sized assets via CloudFront; use `expo-image` with caching.
- **JS Thread**: Offload heavy work (audio processing, stroke normalization) to `react-native-workers` or native modules.
- **Bundle Size**: Use `expo install` and `expo doctor` to keep native dependencies minimal; code‑splitting with dynamic `import()` for heavy screens (e.g., Story mode).

## 6. Testing Strategy
| Type | Tool | Scope |
|------|------|-------|
| Unit | Jest + @testing-library/react-native | Utilities, hooks, reducers |
| Component | Jest + RTL | UI components with mocked navigation/theme |
| Integration | Detox | End‑to‑end flows (login, lesson completion, purchase) |
| E2E (CI) | GitHub Actions (ubuntu‑latest) | Run detox on emulator/simulator |
| Lint | ESLint (eslint-plugin-react-native) + Prettier | Code style |
| Type Checking | TypeScript `noEmit` | Ensure type safety |

## 7. DevOps & Release Process
1. **Feature Branch** → PR → CI runs lint, typecheck, unit tests.
2. **Merge to `main`** → triggers GitHub Actions workflow:
   - Run Detox smoke tests on Android/iOS emulators.
   - Build Android & iOS binaries via EAS (`eas build --platform all --auto-submit`).
   - Publish OTA update (`eas update`) for expo-managed users.
3. **Staging**: Deploy to Firebase App Distribution / TestFlight for QA.
4. **Production**: Promote to stores after approval; enable staged rollout.

## 8. Open Questions / Future Work
- **Evaluation of detached vs managed Expo**: For advanced native modules (custom ML, Bluetooth for external hardware) may need to eject to bare workflow.
- **Dynamic Code Updates**: OTA updates cannot change native code; major native module updates require store release.
- **Scalability of ML Services**: Consider using AWS SageMaker endpoints for speech/handwriting scaling; fallback to on‑device TFLite for low‑latency scenarios.
- **Accessibility**: Ensure all components meet WCAG 2.1 AA; test with TalkBack/VoiceOver.
- **Internationalization**: While focused on Punjabi/Gurmukhi/Shahmukhi, design i18n layer (react-i18next) for future language expansion.

## 9. Conclusion
This architecture leverages React Native’s strengths for rapid, cross‑platform UI while delegating heavy lifting to a robust backend micro‑service ecosystem. It provides offline capability, rich multimedia interactions (speech, handwriting), and a scalable path to millions of learners worldwide.