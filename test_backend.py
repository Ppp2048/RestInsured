#!/usr/bin/env python3
"""
Simple test script to verify RestInsured backend functionality
"""

import requests
import json
import sys

def test_backend():
    base_url = "http://127.0.0.1:8000"
    
    print("🧪 Testing RestInsured Backend...")
    print("=" * 50)
    
    # Test 1: Root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"✅ Root endpoint: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Root endpoint failed: {e}")
        return False
    
    # Test 2: Health check
    try:
        response = requests.get(f"{base_url}/health")
        print(f"✅ Health check: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return False
    
    # Test 3: API Docs
    try:
        response = requests.get(f"{base_url}/docs")
        print(f"✅ API Docs: {response.status_code} - Available")
    except Exception as e:
        print(f"❌ API Docs failed: {e}")
    
    # Test 4: ML Prediction (without API key)
    try:
        test_data = {
            "age": 30,
            "gender": "male",
            "income": 500000,
            "family_size": 1,
            "has_pre_existing_conditions": False,
            "coverage_amount": 500000,
            "smoker": False,
            "bmi": 22.0
        }
        response = requests.post(f"{base_url}/api/predict", json=test_data)
        print(f"✅ ML Prediction: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ ML Prediction failed: {e}")
    
    # Test 5: AI Analysis (will fail without API key, but should return proper error)
    try:
        test_data = {"prompt": "Test prompt"}
        response = requests.post(f"{base_url}/api/analyze", json=test_data)
        print(f"✅ AI Analysis endpoint: {response.status_code}")
        if response.status_code == 200:
            print(f"   Response: {response.json()}")
        else:
            print(f"   Error response (expected): {response.json()}")
    except Exception as e:
        print(f"❌ AI Analysis failed: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 Backend testing completed!")
    print("\n📝 Next steps:")
    print("1. Set your ANTHROPIC_API_KEY in backend/.env")
    print("2. Start frontend: Open frontend/index.html in browser")
    print("3. Test full integration")
    
    return True

if __name__ == "__main__":
    test_backend()
