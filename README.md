# Barrington Public Records

A public-facing research site for the Town of Barrington municipal archive, focused on the Belton Court permit application process. Browse planning documents, meeting transcripts, and video summaries — and ask questions via an AI chat assistant backed by Claude.

## Features

- Browse records by category (planning documents, meeting minutes, correspondence, etc.)
- Full-text search across the archive
- Meeting video links with in-app AI-generated summaries
- **Ask the Archive** — Claude-powered chat assistant for querying the record set

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite |
| Routing | React Router v7 |
| Chat API | Node/Express + Anthropic SDK |
| Hosting | Railway (API) + GitHub Pages / Vercel (frontend) |

## Local Development

### Prerequisites
- Node >= 20

### Frontend

```bash
npm install
npm run dev
```

Runs at `http://localhost:5173`.

### Chat API

```bash
# Set your Anthropic key
echo "ANTHROPIC_API_KEY=sk-ant-..." >> server/.env

npm run chat-api
```

Runs at `http://localhost:3000`. The frontend reads `VITE_CHAT_API_URL` from `.env` to find it.

### Environment Variables

**Root `.env`**
```
VITE_CHAT_API_URL=http://localhost:3000
```

**`server/.env`**
```
PORT=3000
ANTHROPIC_API_KEY=
ANTHROPIC_CHAT_MODEL=claude-haiku-4-5-20251001
ANTHROPIC_MAX_TOKENS=1024
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

## Deployment

The `server/` directory is a standalone Node service deployed to Railway. Set `ANTHROPIC_API_KEY` and `ALLOWED_ORIGINS` in Railway's environment variables panel.
