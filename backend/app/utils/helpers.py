import os
import logging
from typing import Dict, Any

def setup_logging():
    """Setup logging configuration."""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

def validate_env_vars() -> Dict[str, bool]:
    """Validate required environment variables."""
    required_vars = ['ANTHROPIC_API_KEY']
    validation_results = {}
    
    for var in required_vars:
        validation_results[var] = bool(os.getenv(var))
    
    return validation_results

def format_currency(amount: float, currency: str = "₹") -> str:
    """Format amount as currency."""
    return f"{currency}{amount:,.2f}"

def calculate_age_factor(age: int) -> float:
    """Calculate age-based risk factor."""
    if age < 18:
        return 1.2
    elif age < 25:
        return 0.9
    elif age < 35:
        return 1.0
    elif age < 45:
        return 1.1
    elif age < 55:
        return 1.3
    elif age < 65:
        return 1.8
    else:
        return 2.5

def calculate_coverage_factor(coverage_amount: int) -> float:
    """Calculate coverage amount-based factor."""
    # Base coverage is 5 lakhs
    base_coverage = 500000
    return coverage_amount / base_coverage
