# 🚀 Run RestInsured Locally - Complete Guide

## 📋 Prerequisites

1. **Python 3.8+** installed
2. **Google Gemini API Key** (get from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. **Git** (for version control)

## 🔧 Setup Instructions

### Step 1: Clone or Navigate to Project

```bash
# If using Git
git clone <your-repo-url> RestInsured
cd RestInsured

# Or navigate to existing project
cd "c:\Users\KIIT0001\Projects\RestInsured"
```

### Step 2: Create Virtual Environment (Recommended)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
venv\Scripts\activate

# Activate virtual environment (Mac/Linux)
source venv/bin/activate
```

### Step 3: Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install all required packages
pip install -r requirements.txt
```

### Step 4: Set Up Environment Variables

```bash
# Copy the example environment file
copy .env.example .env

# Edit the .env file and add your Gemini API key
# Open .env in any text editor and replace:
# GEMINI_API_KEY=your_gemini_api_key_here
# With your actual API key
```

### Step 5: Train ML Model (First time only)

```bash
# From backend directory
python ml/training/train_model.py
```

### Step 6: Start Backend Server

```bash
# From backend directory
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Step 7: Open Frontend

```bash
# Open frontend in browser
# Option 1: Double-click frontend/index.html
# Option 2: Use live server
cd ../frontend
python -m http.server 5500
```

## 🌐 Access Points

Once running, access the application at:

- **Frontend**: http://localhost:5500 (or file://path/to/frontend/index.html)
- **Backend API**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health

## 🧪 Test the Setup

### Test Backend API

```bash
# Test health endpoint
curl http://127.0.0.1:8000/health

# Test ML prediction
curl -X POST http://127.0.0.1:8000/api/predict ^
  -H "Content-Type: application/json" ^
  -d "{\"age\": 30, \"gender\": \"male\", \"income\": 500000, \"family_size\": 1, \"has_pre_existing_conditions\": false, \"coverage_amount\": 500000, \"smoker\": false, \"bmi\": 22.0}"
```

### Test Full Application

1. Open frontend in browser
2. Fill out the 5-step insurance form
3. Click "Analyze with AI"
4. Should see AI-powered recommendations

## 🔧 Common Issues & Solutions

### Issue: "GEMINI_API_KEY not set"
**Solution**: Ensure you've created `.env` file and added your API key

### Issue: "ModuleNotFoundError: No module named 'google.generativeai'"
**Solution**: Install with `pip install google-generativeai`

### Issue: Port already in use
**Solution**: Change port in uvicorn command:
```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

### Issue: CORS errors
**Solution**: The backend is configured to allow all origins for development

## 📱 Development Workflow

### Making Changes

1. **Backend Changes**: Edit files in `backend/app/`
2. **Frontend Changes**: Edit `frontend/index.html` or `frontend/js/api.js`
3. **Auto-reload**: Backend will restart automatically with `--reload` flag
4. **Refresh**: Refresh browser to see frontend changes

### Testing Changes

```bash
# Run backend tests
python test_backend.py

# Test specific endpoints
curl -X POST http://127.0.0.1:8000/api/analyze -H "Content-Type: application/json" -d "{\"prompt\": \"test prompt\"}"
```

## 🎯 Quick Start Script (Windows)

Run the provided `start.bat` file for automated setup:

```batch
# Double-click start.bat
# Choose option 1 for first-time setup
# Choose option 2 to start backend
```

## 📊 Project Structure Reminder

```
RestInsured/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Business logic
│   │   │   └── gemini_service.py # Gemini AI integration
│   │   └── models/              # Data models
│   ├── ml/                     # Machine learning
│   ├── requirements.txt          # Dependencies
│   └── .env                   # Environment variables (create this)
├── frontend/
│   ├── index.html              # Main application
│   └── js/api.js             # Backend communication
└── README.md                 # Documentation
```

## 🚨 Security Notes

- **Never commit `.env` file** to version control
- **Keep API keys secure** and don't share them
- **Use environment variables** for all sensitive data

## 🎉 Success Indicators

You'll know everything is working when:

✅ Backend starts without errors  
✅ API documentation loads at http://127.0.0.1:8000/docs  
✅ Health check returns `{"status": "healthy"}`  
✅ Frontend loads in browser  
✅ Form submission returns AI analysis  
✅ ML predictions work for premium calculation  

## 📞 Need Help?

1. Check the terminal output for error messages
2. Verify your Gemini API key is valid
3. Ensure all dependencies are installed
4. Check that ports 8000 and 5500 are available

---

**Happy coding! 🚀**
