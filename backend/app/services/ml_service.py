import pickle
import numpy as np
import pandas as pd
from typing import Dict, Any, Optional
import os

class MLPremiumPredictor:
    def __init__(self):
        self.model = None
        self.model_path = os.path.join(os.path.dirname(__file__), "../../ml/model/premium_model.pkl")
        self.load_model()
    
    def load_model(self):
        """Load the trained ML model."""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
            else:
                # Fallback to a simple rule-based prediction if model not found
                self.model = None
        except Exception as e:
            print(f"Error loading model: {e}")
            self.model = None
    
    def preprocess_input(self, data: Dict[str, Any]) -> np.ndarray:
        """Preprocess input data for ML model."""
        # Extract features from input
        features = [
            data.get('age', 30),
            1 if data.get('gender', 'male').lower() == 'male' else 0,
            data.get('income', 500000),
            data.get('family_size', 1),
            1 if data.get('has_pre_existing_conditions', False) else 0,
            data.get('coverage_amount', 500000),
            1 if data.get('smoker', False) else 0,
            data.get('bmi', 22.0)
        ]
        return np.array(features).reshape(1, -1)
    
    def predict_premium(self, data: Dict[str, Any]) -> float:
        """Predict insurance premium based on input data."""
        if self.model is None:
            # Fallback rule-based calculation
            return self.rule_based_prediction(data)
        
        try:
            features = self.preprocess_input(data)
            premium = self.model.predict(features)[0]
            return max(0, premium)  # Ensure non-negative
        except Exception as e:
            print(f"ML prediction failed: {e}")
            return self.rule_based_prediction(data)
    
    def rule_based_prediction(self, data: Dict[str, Any]) -> float:
        """Fallback rule-based premium calculation."""
        base_premium = 2000
        
        # Age factor
        age = data.get('age', 30)
        if age < 25:
            base_premium *= 0.8
        elif age > 50:
            base_premium *= 1.5
        
        # Coverage amount factor
        coverage = data.get('coverage_amount', 500000)
        coverage_factor = coverage / 500000
        base_premium *= coverage_factor
        
        # Health factors
        if data.get('has_pre_existing_conditions', False):
            base_premium *= 1.8
        
        if data.get('smoker', False):
            base_premium *= 1.6
        
        # Family size
        family_size = data.get('family_size', 1)
        base_premium *= (1 + (family_size - 1) * 0.3)
        
        return round(base_premium, 2)

# Global predictor instance
predictor = MLPremiumPredictor()

def predict_premium(data: Dict[str, Any]) -> float:
    """Predict insurance premium using ML model."""
    return predictor.predict_premium(data)
