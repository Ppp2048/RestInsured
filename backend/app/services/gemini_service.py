import google.generativeai as genai
import os
from typing import Dict, Any

def get_ai_analysis(prompt: str) -> Dict[str, Any]:
    """
    Get AI analysis from Gemini API for insurance recommendations.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable not set")
    
    try:
        # Configure Gemini API
        genai.configure(api_key=api_key)
        
        # Initialize the model (using a globally available model alias)
        model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Generate response
        response = model.generate_content(prompt)
        
        # Return the response text
        return {"content": [{"text": response.text}]}
        
    except Exception as e:
        raise Exception(f"Failed to call Gemini API: {str(e)}")
