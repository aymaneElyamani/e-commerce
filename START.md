# E-Commerce Full Stack Application

## Quick Start Guide

### Prerequisites
Make sure you have installed all dependencies:

**macOS/Linux:**
```bash
./install.sh
```

**Windows:**
```bash
.\install.sh
```

### Environment Setup

Before running the application, you need to configure environment variables:

#### Backend Environment Variables

**macOS/Linux:**
```bash
cd backend
cp .env.example .env
# Edit .env file with your configuration
```

**Windows:**
```bash
cd backend
copy .env.example .env
# Edit .env file with your configuration
```

#### Frontend Environment Variables

**macOS/Linux:**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local file with your configuration
```

**Windows:**
```bash
cd frontend
copy .env.example .env.local
# Edit .env.local file with your configuration
```

**Important:** Update the `.env` files with your actual values:
- Database credentials
- API keys (Stripe, email, etc.)
- API URLs
- Secret keys

---

## Running the Application

You need to run **3 services** in **3 separate terminals**:

---

### Terminal 1: Backend (Flask)

**macOS/Linux:**
```bash
cd backend
source .venv/bin/activate
python3 app.py
```

**Windows:**
```bash
cd backend
.venv\Scripts\activate
python app.py
```

**Running at:** http://localhost:5000  
**Admin panel:** http://localhost:5000/admin

---

### Terminal 2: Frontend (Next.js)

**macOS/Linux/Windows:**
```bash
cd frontend
npm run dev
```

**Running at:** http://localhost:3000

---

### Terminal 3: Model 3D (Vite + React)

**macOS/Linux/Windows:**
```bash
cd model3d
npm run dev
```

**Running at:** http://localhost:5173

---

## Quick Commands

### Install Dependencies

**macOS/Linux:**
```bash
./install.sh
```

**Windows:**
```bash
.\install.sh
```

### View Instructions

**macOS/Linux:**
```bash
./run.sh
```

**Windows:**
```bash
.\run.sh
```

---

## URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main e-commerce site |
| Backend API | http://localhost:5000 | REST API |
| Admin Panel | http://localhost:5000/admin | Admin dashboard |
| 3D Model | http://localhost:5173 | 3D customization |

---

## Troubleshooting

### Backend won't start

**macOS/Linux:**
- Make sure virtual environment is activated: `source .venv/bin/activate`
- Check if Python 3 is installed: `python3 --version`

**Windows:**
- Make sure virtual environment is activated: `.venv\Scripts\activate`
- Check if Python is installed: `python --version`

### Frontend/Model3D won't start
- Install dependencies: `npm install`
- Check if Node.js is installed: `node --version`

### Port already in use
- Stop other services using the same port
- Or change the port in the respective config files

### Virtual Environment Issues

**macOS/Linux:**
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Windows:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```
