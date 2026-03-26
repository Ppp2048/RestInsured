# 🚀 GitHub Deployment Guide for RestInsured

## 📋 Deployment Options

### Option 1: GitHub Pages (Frontend) + Railway/Render (Backend)
### Option 2: Vercel (Full Stack)
### Option 3: DigitalOcean App Platform
### Option 4: Heroku (Backend) + Netlify (Frontend)

---

## 🎯 Recommended: GitHub Pages + Railway

### Step 1: Prepare Repository for GitHub

```bash
# Navigate to project directory
cd "c:\Users\KIIT0001\Projects\RestInsured"

# Initialize Git (if not already done)
git init
git add .
git commit -m "Initial commit: RestInsured with Gemini AI integration"

# Add remote repository
git remote add origin https://github.com/Ppp2048/RestInsured.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to GitHub Pages

1. **Create gh-pages branch**:
```bash
git checkout --orphan gh-pages
git --work-tree add frontend/
git commit -m "Deploy frontend to GitHub Pages"
git push origin gh-pages
```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Save

3. **Frontend will be available at**: `https://Ppp2048.github.io/RestInsured/`

### Step 3: Deploy Backend to Railway

1. **Prepare backend for deployment**:
```bash
# Create railway-specific files
echo "python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT" > backend/start.sh
echo "web: python start.sh" > backend/Procfile
```

2. **Deploy to Railway**:
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Select `backend` folder as root directory
   - Add environment variable: `GEMINI_API_KEY=your_actual_key`
   - Deploy

3. **Backend will be available at**: `https://your-app-name.up.railway.app`

### Step 4: Update Frontend API URL

```javascript
// In frontend/js/api.js
const API_BASE_URL = 'https://your-app-name.up.railway.app/api';
```

---

## 🔧 Production Configuration Files

### Create `backend/Procfile` (for Railway/Heroku)
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Create `backend/requirements.txt` (already exists)
### Create `backend/.env` (never commit to Git)

### Create `vercel.json` (for Vercel deployment)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/app/main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "backend/app/main.py"
    }
  ]
}
```

---

## 🌐 Alternative Deployment Options

### Option A: Vercel (Full Stack)

1. **Install Vercel CLI**:
```bash
npm i -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Environment Variables**:
   - Add `GEMINI_API_KEY` in Vercel dashboard

### Option B: DigitalOcean App Platform

1. **Create `do-app.yaml`**:
```yaml
name: restinsured
services:
- name: api
  source_dir: backend
  github:
    repo: Ppp2048/RestInsured
    branch: main
  run_command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
  environment_slug: python
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: GEMINI_API_KEY
    value: ${GEMINI_API_KEY}
  http_port: 8000
  routes:
  - path: /
```

### Option C: Heroku + Netlify

**Backend (Heroku)**:
```bash
# Install Heroku CLI
heroku create restinsured-api
heroku config:set GEMINI_API_KEY=your_key
git subtree push --prefix backend heroku main
```

**Frontend (Netlify)**:
- Drag `frontend` folder to [netlify.com](https://netlify.com)
- Update API URL in `frontend/js/api.js`

---

## 🔒 Environment Variables in Production

### Required Variables
- `GEMINI_API_KEY`: Your Google Gemini API key
- `DEBUG`: Set to `False` in production

### Optional Variables
- `CORS_ORIGINS`: Your frontend domain
- `DATABASE_URL`: For future database integration

---

## 📊 Monitoring & Logging

### Add Health Checks
```python
# Already implemented in backend/app/main.py
@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

### Monitoring Services
- **Railway**: Built-in logs and metrics
- **Vercel**: Built-in analytics
- **DigitalOcean**: App Platform monitoring

---

## 🔄 CI/CD Pipeline

### Create `.github/workflows/deploy.yml`
```yaml
name: Deploy RestInsured

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to Railway
      uses: railway-app/railway-action@v1
      with:
        api-token: ${{ secrets.RAILWAY_TOKEN }}
        service-id: ${{ secrets.RAILWAY_SERVICE_ID }}
  
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend
```

---

## 🎯 Production Checklist

### Security ✅
- [ ] API keys in environment variables
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation active
- [ ] Rate limiting considered

### Performance ✅
- [ ] CDN for static assets
- [ ] Database indexing (if using DB)
- [ ] Response time monitoring
- [ ] Error tracking

### Reliability ✅
- [ ] Health checks configured
- [ ] Logging implemented
- [ ] Backup strategy
- [ ] Error alerts

---

## 📱 Domain Configuration

### Custom Domain Setup
1. **DNS Configuration**:
   - Frontend: A record to GitHub Pages/Netlify
   - Backend: CNAME/A record to Railway/Vercel

2. **SSL Certificates**:
   - Usually handled automatically by platform
   - Verify HTTPS is working

---

## 🚀 Quick Deployment Commands

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Vercel
```bash
# Install and deploy
npm i -g vercel
vercel --prod
```

### GitHub Pages (Frontend Only)
```bash
# Deploy frontend
git subtree push --prefix frontend origin gh-pages
```

---

## 📞 Support & Troubleshooting

### Common Deployment Issues

1. **API Key Errors**:
   - Check environment variables in deployment platform
   - Verify API key is valid and has quota

2. **CORS Issues**:
   - Update CORS origins in production
   - Ensure frontend URL is whitelisted

3. **Build Failures**:
   - Check requirements.txt for correct versions
   - Verify Python version compatibility

4. **Runtime Errors**:
   - Check deployment logs
   - Verify all dependencies are installed

### Monitoring URLs
- **Railway**: `https://railway.app/project/<project-id>`
- **Vercel**: `https://vercel.com/dashboard`
- **GitHub Pages**: Repository Settings → Pages

---

**🎉 Your RestInsured application is now ready for production deployment!**
