# NaukriSetu — India's Government Jobs Portal

## 🚀 Setup Guide

### Prerequisites
- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd NaukriSetu

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
cp .env.example .env  # Fill in your API keys
```

### Running Locally

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev  # Starts on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev  # Starts on http://localhost:5173
```

### Environment Variables
See `backend/.env.example` for all required variables.

## ⚠️ SECURITY RULES — READ BEFORE CONTRIBUTING

1. **NEVER** commit `.env` files — they are in `.gitignore`
2. **NEVER** put API keys in frontend code (even as comments)
3. **NEVER** paste API keys in GitHub issues or PRs
4. All API keys live **only** in `backend/.env` and Vercel environment variables
5. The frontend **only** calls `/api/*` endpoints on NaukriSetu's own backend

## Architecture

```
Frontend (React+Vite) → Backend (Express/Vercel) → Firestore/JSON Cache
                                    ↓
              Cron Job → NewsAPI + GNews + JSearch + SerpAPI + RSS
                                    ↓
                         Gemini AI Processing → Data Store
```

## License
MIT
