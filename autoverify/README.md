# AutoVerify — Used Car Analysis System

Full-stack web application: React + Node.js/Express + MongoDB

## Project Structure
```
autoverify/
├── backend/          # Node.js + Express API
└── frontend/         # React Application
```

## Quick Start

### 1. Start MongoDB
Make sure MongoDB is running locally:
```bash
mongod
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env      # Edit .env with your settings
npm run dev               # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start                 # Runs on http://localhost:3000
```

## Demo Accounts
After starting, register any account. Then verify these plates:
- `PB10BF1234` — Maruti Swift (Moderate Risk, 74/100)
- `DL3CAF5678` — Honda City (Low Risk, 91/100)
- `HR26DQ9012` — Hyundai Creta (High Risk, 42/100)

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios
- **Backend**: Node.js, Express.js, JWT Auth, bcrypt
- **Database**: MongoDB + Mongoose ODM

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET  | /api/auth/me | Get current user |
| POST | /api/vehicles/analyze | Analyze a vehicle |
| GET  | /api/vehicles/history | Get user's search history |
| GET  | /api/reports | Get all reports |
| GET  | /api/reports/:id | Get single report |
| DELETE | /api/reports/:id | Delete a report |
| GET  | /api/users/stats | Get user stats |
| PUT  | /api/users/profile | Update profile |
| PUT  | /api/users/change-password | Change password |
| PUT  | /api/users/notifications | Update notification settings |
