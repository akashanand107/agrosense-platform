# AgroSense Pro

AgroSense Pro is a robust agricultural intelligence platform combining a Next.js frontend with a Python FastAPI backend.

## Project Structure

- **frontend/**: Next.js 14 application with Aceternity UI and Tailwind CSS v4.
- **backend/**: FastAPI application for ML model inference.

## Quick Start

### 1. Start the Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
The API will run at `http://localhost:8000`.

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
The web app will run at `http://localhost:3000`.
# agrosense-platform
