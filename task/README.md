# 🏥 Healthcare Platform - Code Quality Assessment Task

## 📋 Overview

Welcome to the Healthcare Platform debugging challenge! This is a full-stack doctor appointment and telemedicine application built with **React**, **TypeScript**, **Node.js**, **Express**, and **MongoDB**.

**Your mission:** This codebase contains **intentional bugs, security vulnerabilities, performance issues,any type issues, and code quality problems**. Your task is to identify, document, and fix these issues.

---


Create a document (Markdown, PDF, or Google Doc) with:
- **Issues Found** - Categorized list with severity levels
- **Solutions Implemented** - Code changes with explanations
- **Testing Evidence** - Screenshots or descriptions of how you verified fixes
- **Recommendations** - Additional improvements for production readiness

---


## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and Install Dependencies**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

2. **Environment Setup**

Backend `.env` (already provided but check for issues):
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

Frontend `.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

3. **Run the Application**

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

4. **Access the Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
