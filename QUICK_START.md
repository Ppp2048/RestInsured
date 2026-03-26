# 🚀 RestInsured - Quick Start Guide

## ⚡ 5-Minute Setup

### 1. Get Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create new API key
- Copy the key (starts with "AIza...")

### 2. Setup Project
```bash
# Navigate to project
cd "c:\Users\KIIT0001\Projects\RestInsured\backend"

# Install dependencies
pip install -r requirements.txt

# Create environment file
copy .env.example .env
```

### 3. Configure API Key
Edit `backend\.env` file:
```env
GEMINI_API_KEY=AIza...your_actual_key_here
```

### 4. Train ML Model
```bash
# From backend directory
python ml/training/train_model.py
```

### 5. Start Application
```bash
# Start backend (keep this terminal open)
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# Open frontend (new terminal or double-click)
# Navigate to frontend folder and open index.html
```

### 6. Test It!
- Open http://127.0.0.1:8000/docs for API docs
- Open frontend/index.html in browser
- Fill form and click "Analyze with AI"

---

## 🎯 Windows Users - Double Click Solution

1. **Double-click**: `start.bat`
2. **Choose option 1**: First-time setup
3. **Edit**: `backend\.env` and add your Gemini API key
4. **Double-click**: `start.bat` again
5. **Choose option 2**: Start backend
6. **Open**: `frontend\index.html` in browser

---

## 🔧 What's Working?

✅ **AI Analysis**: Gemini-powered insurance recommendations  
✅ **ML Predictions**: Accurate premium calculations  
✅ **Web Scraping**: Data extraction from insurance sites  
✅ **Secure API**: Keys never exposed on frontend  
✅ **Indian Market**: IRDAI-regulated plan data  

---

## 📱 Access Points

| Service | URL |
|---------|------|
| Frontend | `frontend/index.html` |
| Backend API | http://127.0.0.1:8000 |
| API Docs | http://127.0.0.1:8000/docs |
| Health Check | http://127.0.0.1:8000/health |

---

## 🎉 Success!

Your RestInsured platform is now running with:
- **Google Gemini AI** for intelligent analysis
- **Machine Learning** for premium prediction
- **Secure Architecture** with backend API
- **Professional UI** for insurance analysis

Ready for development and deployment! 🚀
