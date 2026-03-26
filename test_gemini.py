#!/usr/bin/env python3
"""
Test script for Gemini API integration
"""

import os
import sys
sys.path.append('backend')

from app.services.gemini_service import get_ai_analysis

def test_gemini():
    print("🧪 Testing Gemini AI Integration...")
    print("=" * 50)
    
    # Check environment variable
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ GEMINI_API_KEY not found in environment variables")
        print("📝 Please set up your .env file with:")
        print("   GEMINI_API_KEY=AIza...your_key_here")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...{api_key[-4:]}")
    
    # Test simple analysis
    test_prompt = """
    You are an insurance expert. Analyze this profile:
    - Age: 30, Gender: Male, Income: ₹6 LPA
    - No pre-existing conditions, non-smoker
    Provide a brief risk assessment and estimated premium range.
    Respond in JSON format with risk_score (1-100) and premium_range.
    """
    
    try:
        print("\n🤖 Testing Gemini API call...")
        result = get_ai_analysis(test_prompt)
        
        if result and 'content' in result:
            print("✅ Gemini API response received!")
            print(f"📝 Response: {result['content'][0]['text'][:200]}...")
            return True
        else:
            print("❌ Invalid response format")
            return False
            
    except Exception as e:
        print(f"❌ Gemini API call failed: {e}")
        return False

def setup_env_file():
    """Help user set up environment file"""
    print("\n🔧 Setting up .env file...")
    
    env_path = "backend/.env"
    env_content = """# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Database Configuration (for future use)
# DATABASE_URL=postgresql://user:password@localhost/restinsured

# Other Configuration
DEBUG=True
CORS_ORIGINS=["http://localhost:3000", "http://127.0.0.1:5500"]
"""
    
    try:
        with open(env_path, 'w') as f:
            f.write(env_content)
        print(f"✅ Created {env_path}")
        print("📝 Please edit this file and add your actual Gemini API key")
        print("🔑 Get your key from: https://aistudio.google.com/app/apikey")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

if __name__ == "__main__":
    print("🎯 RestInsured - Gemini AI Test")
    print("=" * 50)
    
    # Check if .env exists
    if not os.path.exists("backend/.env"):
        print("⚠️  .env file not found")
        choice = input("Create .env file? (y/n): ").lower()
        if choice == 'y':
            setup_env_file()
    
    # Test Gemini integration
    success = test_gemini()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 Gemini AI integration is working!")
        print("\n📋 Next steps:")
        print("1. Start backend: cd backend && python -m uvicorn app.main:app --reload")
        print("2. Open frontend: frontend/index.html")
        print("3. Test full application")
    else:
        print("❌ Gemini AI integration failed")
        print("\n📋 Troubleshooting:")
        print("1. Verify your API key is correct")
        print("2. Check internet connection")
        print("3. Ensure google-generativeai package is installed")
        print("4. Try running: pip install google-generativeai==0.8.3")
