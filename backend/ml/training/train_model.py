import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import pickle
import os

def generate_synthetic_data(n_samples=1000):
    """Generate synthetic insurance data for training."""
    np.random.seed(42)
    
    data = {
        'age': np.random.randint(18, 70, n_samples),
        'gender': np.random.choice(['male', 'female'], n_samples),
        'income': np.random.randint(100000, 2000000, n_samples),
        'family_size': np.random.randint(1, 6, n_samples),
        'has_pre_existing_conditions': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'coverage_amount': np.random.choice([200000, 500000, 1000000, 2000000], n_samples),
        'smoker': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
        'bmi': np.random.normal(24, 4, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Calculate premium based on factors (realistic calculation)
    base_premium = 3000
    
    # Age factor
    age_factor = np.where(df['age'] < 25, 0.8,
                         np.where(df['age'] > 50, 1.5, 1.0))
    
    # Gender factor
    gender_factor = np.where(df['gender'] == 'male', 1.1, 1.0)
    
    # Income factor (inverse - higher income = lower relative premium)
    income_factor = 1.2 - (df['income'] / 2000000) * 0.4
    
    # Family size factor
    family_factor = 1 + (df['family_size'] - 1) * 0.3
    
    # Pre-existing conditions factor
    pre_existing_factor = np.where(df['has_pre_existing_conditions'] == 1, 1.8, 1.0)
    
    # Coverage amount factor
    coverage_factor = df['coverage_amount'] / 500000
    
    # Smoker factor
    smoker_factor = np.where(df['smoker'] == 1, 1.6, 1.0)
    
    # BMI factor
    bmi_factor = np.where(df['bmi'] > 30, 1.4, np.where(df['bmi'] < 18.5, 1.2, 1.0))
    
    # Calculate final premium with some noise
    df['premium'] = base_premium * age_factor * gender_factor * income_factor * \
                   family_factor * pre_existing_factor * coverage_factor * \
                   smoker_factor * bmi_factor
    
    # Add some random noise
    df['premium'] = df['premium'] * np.random.normal(1.0, 0.1, n_samples)
    
    return df

def preprocess_data(df):
    """Preprocess the data for training."""
    # Convert categorical variables
    df['gender'] = df['gender'].map({'male': 1, 'female': 0})
    
    # Ensure BMI is reasonable
    df['bmi'] = np.clip(df['bmi'], 15, 40)
    
    return df

def train_model():
    """Train the premium prediction model."""
    print("Generating synthetic data...")
    df = generate_synthetic_data(1000)
    
    print("Preprocessing data...")
    df = preprocess_data(df)
    
    # Features and target
    feature_columns = ['age', 'gender', 'income', 'family_size', 
                      'has_pre_existing_conditions', 'coverage_amount', 
                      'smoker', 'bmi']
    
    X = df[feature_columns]
    y = df['premium']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    y_pred = model.predict(X_test_scaled)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    print(f"Model Performance:")
    print(f"Mean Absolute Error: ₹{mae:.2f}")
    print(f"R² Score: {r2:.4f}")
    
    # Save model and scaler
    model_dir = os.path.dirname(os.path.dirname(__file__)) + '/model'
    os.makedirs(model_dir, exist_ok=True)
    
    with open(f'{model_dir}/premium_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    with open(f'{model_dir}/feature_scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save feature columns for reference
    with open(f'{model_dir}/feature_columns.pkl', 'wb') as f:
        pickle.dump(feature_columns, f)
    
    print(f"Model saved to {model_dir}/premium_model.pkl")
    
    return model, scaler, feature_columns

if __name__ == "__main__":
    train_model()
