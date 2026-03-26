import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
import pickle
import os

class DataPreprocessor:
    def __init__(self):
        self.scaler = None
        self.feature_columns = None
        self.load_artifacts()
    
    def load_artifacts(self):
        """Load saved preprocessing artifacts."""
        model_dir = os.path.dirname(os.path.dirname(__file__)) + '/model'
        
        try:
            with open(f'{model_dir}/feature_scaler.pkl', 'rb') as f:
                self.scaler = pickle.load(f)
            with open(f'{model_dir}/feature_columns.pkl', 'rb') as f:
                self.feature_columns = pickle.load(f)
        except FileNotFoundError:
            print("Preprocessing artifacts not found. Using default configuration.")
            self.feature_columns = ['age', 'gender', 'income', 'family_size', 
                                   'has_pre_existing_conditions', 'coverage_amount', 
                                   'smoker', 'bmi']
            self.scaler = StandardScaler()
    
    def preprocess_input(self, data: dict) -> np.ndarray:
        """Preprocess single input for prediction."""
        # Convert to DataFrame
        df = pd.DataFrame([data])
        
        # Apply preprocessing
        df = self.clean_data(df)
        df = self.encode_categorical(df)
        
        # Ensure all required columns are present
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0  # Default value
        
        # Select and order features
        features = df[self.feature_columns]
        
        # Scale features
        if self.scaler:
            features_scaled = self.scaler.transform(features)
        else:
            features_scaled = features.values
        
        return features_scaled
    
    def clean_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and validate input data."""
        # Age validation
        df['age'] = np.clip(df['age'], 18, 100)
        
        # Income validation
        df['income'] = np.maximum(df['income'], 0)
        
        # Family size validation
        df['family_size'] = np.clip(df['family_size'], 1, 10)
        
        # Coverage amount validation
        df['coverage_amount'] = np.maximum(df['coverage_amount'], 50000)
        
        # BMI validation
        df['bmi'] = np.clip(df['bmi'], 10, 50)
        
        return df
    
    def encode_categorical(self, df: pd.DataFrame) -> pd.DataFrame:
        """Encode categorical variables."""
        # Gender encoding
        if 'gender' in df.columns:
            df['gender'] = df['gender'].map({'male': 1, 'female': 0}).fillna(0)
        
        # Boolean to int conversion
        bool_columns = ['has_pre_existing_conditions', 'smoker']
        for col in bool_columns:
            if col in df.columns:
                df[col] = df[col].astype(int)
        
        return df
    
    def preprocess_batch(self, data: list) -> np.ndarray:
        """Preprocess batch of inputs."""
        df = pd.DataFrame(data)
        df = self.clean_data(df)
        df = self.encode_categorical(df)
        
        # Ensure all required columns are present
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0
        
        features = df[self.feature_columns]
        
        if self.scaler:
            return self.scaler.transform(features)
        else:
            return features.values
