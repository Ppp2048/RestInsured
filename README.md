# RestInsured - AI + ML Insurance Analysis Platform for India

A comprehensive full-stack platform that combines artificial intelligence and machine learning to provide personalized insurance recommendations and premium predictions for Indian market.

## 🚀 Features

- **AI-Powered Analysis**: Google Gemini AI integration for intelligent insurance recommendations
- **ML Premium Prediction**: Machine learning models for accurate premium estimation
- **Web Scraping**: Automated data extraction from insurance provider websites
- **Multi-Tab Interface**: Analyzer, Plan Comparison, and Policy Scraper modules
- **Secure Architecture**: API keys never exposed on frontend
- **Indian Market Focus**: Tailored for IRDAI-regulated insurance plans

## 🏗️ Architecture

```
User → Frontend → FastAPI Backend → → ML Model (premium prediction)
                                 → → AI API (recommendation + explanation)
                                 → → Database (future)
```

## 📁 Project Structure

```
RestInsured/
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI entry point
│   │   ├── routes/
│   │   │   ├── analyze.py          # AI analysis endpoint
│   │   │   ├── predict.py          # ML prediction endpoint
│   │   │   └── scrape.py           # Web scraping endpoint
│   │   ├── services/
│   │   │   ├── claude_service.py   # Claude AI integration
│   │   │   ├── ml_service.py       # ML model service
│   │   │   └── scraper_service.py  # Web scraping service
│   │   ├── models/
│   │   │   └── schemas.py          # Pydantic models
│   │   └── utils/
│   │       └── helpers.py           # Utility functions
│   │
│   ├── ml/
│   │   ├── training/
│   │   │   └── train_model.py       # ML model training script
│   │   ├── model/
│   │   │   └── premium_model.pkl    # Trained model (generated)
│   │   └── preprocessing/
│   │       └── preprocess.py        # Data preprocessing
│   │
│   ├── data/
│   │   ├── raw/                     # Raw data
│   │   ├── processed/               # Processed data
│   │   └── scraped/                 # Scraped data
│   │
│   ├── requirements.txt             # Python dependencies
│   └── .env                         # Environment variables
│
├── frontend/
│   ├── index.html                   # Main application
│   ├── js/
│   │   └── api.js                   # Backend API client
│   └── styles/                      # CSS styles
│
├── notebooks/                       # Jupyter notebooks for analysis
├── README.md
└── .gitignore
```

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern Python web framework
- **Python 3.8+**: Core programming language
- **Scikit-learn**: Machine learning library
- **Pandas & NumPy**: Data processing
- **BeautifulSoup4**: Web scraping
- **Pydantic**: Data validation
- **Requests**: HTTP client

### Frontend
- **HTML5/CSS3/JavaScript**: Core web technologies
- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Dark theme with gold accents

### AI/ML
- **Claude AI**: Natural language processing
- **Random Forest**: Premium prediction model
- **Data Preprocessing**: Feature engineering

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your ANTHROPIC_API_KEY

# Train the ML model
python ml/training/train_model.py

# Start the FastAPI server
uvicorn app.main:app --reload
```

The backend will be available at `http://127.0.0.1:8000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Open index.html in your browser
# Or serve with a local web server
python -m http.server 5500
```

### 3. API Documentation

Once the backend is running, visit:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration (for future use)
# DATABASE_URL=postgresql://user:password@localhost/restinsured

# Other Configuration
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:5500"]
```

## 📊 API Endpoints

### Analysis
- `POST /api/analyze` - AI-powered insurance analysis

### Prediction
- `POST /api/predict` - ML-based premium prediction

### Scraping
- `POST /api/scrape` - Web scraping for insurance data

### Health
- `GET /` - Root endpoint
- `GET /health` - Health check

## 🤖 AI Integration

The platform uses Google Gemini AI for:
- Personalized insurance recommendations
- Risk assessment analysis
- Policy document analysis
- Natural language explanations

## 📈 ML Model

The premium prediction model uses:
- **Random Forest Regressor**
- **8 key features**: Age, Gender, Income, Family Size, Pre-existing Conditions, Coverage Amount, Smoking Status, BMI
- **Synthetic data training** with realistic Indian market parameters
- **Fallback rule-based calculation** when model is unavailable

## 🔒 Security Features

- **API Key Protection**: Never exposed on frontend
- **Environment Variables**: Secure configuration management
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Pydantic models for data validation

## 🌐 Indian Market Focus

- **IRDAI-Regulated Plans**: 40+ plans from 15 leading insurers
- **Realistic Premiums**: Based on 2024-25 market data
- **Local Factors**: Age, occupation, family structure, health conditions
- **Tax Benefits**: Section 80D considerations
- **Claim Ratios**: IRDAI annual report data

## 🚧 Future Enhancements

- [ ] Database integration (PostgreSQL)
- [ ] User authentication system
- [ ] Real-time premium updates
- [ ] Mobile app development
- [ ] Advanced ML models
- [ ] Multi-language support
- [ ] Payment gateway integration

## 📝 Usage Examples

### Basic Analysis
1. Fill in the 5-step form with personal details
2. Click "Analyze with AI"
3. Receive personalized recommendations

### Policy Scraper
1. Paste policy text or enter URL
2. Click "Analyze Policy"
3. Get detailed policy analysis and value score

### Plan Comparison
1. Browse 40+ insurance plans
2. Filter by type (Health, Term, Critical Illness, etc.)
3. Compare premiums, claim ratios, and features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support:
- Create an issue on GitHub
- Check the API documentation
- Review the code comments

## 🙏 Acknowledgments

- **Google**: Gemini AI API
- **IRDAI**: Insurance regulatory data
- **Indian Insurers**: Plan information and premium data
- **Open Source Community**: Tools and libraries

---

**Built with ❤️ for the Indian insurance market**
