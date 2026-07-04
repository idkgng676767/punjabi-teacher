# PunjabiLingo

PunjabiLingo is a Punjabi learning workspace with a React web app, an Express API, and a separate React Native prototype.

## Workspace layout

- `frontend-web/` - React + Vite web app
- `backend/` - Express API with lessons, auth, progress, and leaderboard routes
- `mobile/` - React Native / Expo prototype
- `plan_part1.md` to `plan_part4.md` - original product blueprint

## Run the web app

```bash
cd frontend-web
npm install
npm run dev
```

Build the web app with:

```bash
npm run build
```

## Run the API

```bash
cd backend
npm install
JWT_SECRET=your_secret_key npm start
```

Useful endpoints:

- `GET /api/lessons`
- `GET /api/lessons/:id`
- `GET /api/profile`
- `POST /api/progress`
- `GET /api/leaderboard`

## Notes

- The backend currently keeps users in memory, so data resets when the server restarts.
- The mobile app is separate from the web app and is not wired into the web build.
- The codebase now focuses on the working surfaces instead of the original oversized product plan.