# Project Setup and Environment Configuration

## Overview
This repository contains a full-stack healthcare platform for doctor appointments and telemedicine.

Tech stack:
- Frontend: React + TypeScript + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- AI: Gemini API (patient health recommendations)

## Prerequisites
- Node.js v16+ and npm
- MongoDB (local instance or Atlas)
- Access to required API keys (Gemini, Google OAuth, AWS S3 if used)

## Install Dependencies
Run these commands from the project root (the folder that contains `backend` and `frontend`).

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Variables
Create `.env` files in both `backend/` and `frontend/`.
Use `.env.example` (if present) as a starting point and keep secrets out of git.

### Backend: `backend/.env`
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name
```

Notes:
- `MONGODB_URI` must point to a reachable MongoDB instance.
- `GEMINI_API_KEY` is required for AI recommendations.
- Google OAuth and AWS S3 keys are required only if those features are enabled.
- If you change ports, update `FRONTEND_URL` and the frontend `VITE_API_URL`.

### Frontend: `frontend/.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## Run the Project
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

## Access
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Quick Sanity Checks
- Verify MongoDB is running and reachable.
- Confirm ports `5000` and `5173` are free.
- If the frontend cannot reach the backend, check `VITE_API_URL` and `FRONTEND_URL`.
