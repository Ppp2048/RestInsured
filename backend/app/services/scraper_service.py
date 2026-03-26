import requests
from bs4 import BeautifulSoup
from typing import Dict, Any, List
import time
import re

def scrape_insurance_data(provider_url: str, data_type: str = "premium") -> Dict[str, Any]:
    """
    Scrape insurance data from provider websites.
    Note: This is a basic implementation. In production, you'd need more sophisticated
    scraping with proper headers, rate limiting, and respect for robots.txt
    """
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    try:
        response = requests.get(provider_url, headers=headers, timeout=10)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.content, 'html.parser')
        
        if data_type == "premium":
            return extract_premium_info(soup)
        elif data_type == "coverage":
            return extract_coverage_info(soup)
        elif data_type == "exclusions":
            return extract_exclusions_info(soup)
        elif data_type == "claim_ratio":
            return extract_claim_ratio_info(soup)
        else:
            return {"error": f"Unsupported data type: {data_type}"}
            
    except requests.exceptions.RequestException as e:
        return {"error": f"Failed to scrape {provider_url}: {str(e)}"}
    except Exception as e:
        return {"error": f"Error parsing scraped data: {str(e)}"}

def extract_premium_info(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract premium information from page content."""
    # Look for common premium-related keywords and patterns
    premium_patterns = [
        r'₹\s*[\d,]+',
        r'premium\s*[:\-]\s*₹?\s*[\d,]+',
        r'rs\.?\s*[\d,]+',
        r'rupees?\s*[\d,]+'
    ]
    
    premiums_found = []
    for pattern in premium_patterns:
        matches = re.findall(pattern, soup.get_text(), re.IGNORECASE)
        premiums_found.extend(matches)
    
    return {
        "type": "premium",
        "data": premiums_found[:5],  # Return first 5 matches
        "source": "scraped_content"
    }

def extract_coverage_info(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract coverage information from page content."""
    coverage_keywords = ['coverage', 'sum insured', 'coverage amount', 'insurance cover']
    
    coverage_data = []
    for keyword in coverage_keywords:
        elements = soup.find_all(text=re.compile(keyword, re.IGNORECASE))
        for element in elements:
            # Get surrounding text for context
            parent = element.parent
            if parent:
                coverage_data.append(parent.get_text().strip()[:200])
    
    return {
        "type": "coverage",
        "data": coverage_data[:3],  # Return first 3 matches
        "source": "scraped_content"
    }

def extract_exclusions_info(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract exclusion information from page content."""
    exclusion_keywords = ['exclusion', 'not covered', 'excluded', 'limitations']
    
    exclusions_data = []
    for keyword in exclusion_keywords:
        elements = soup.find_all(text=re.compile(keyword, re.IGNORECASE))
        for element in elements:
            parent = element.parent
            if parent:
                exclusions_data.append(parent.get_text().strip()[:200])
    
    return {
        "type": "exclusions",
        "data": exclusions_data[:3],
        "source": "scraped_content"
    }

def extract_claim_ratio_info(soup: BeautifulSoup) -> Dict[str, Any]:
    """Extract claim ratio information from page content."""
    claim_ratio_patterns = [
        r'claim\s*ratio[:\-]\s*[\d\.]+%',
        r'incurred\s*claim\s*ratio[:\-]\s*[\d\.]+%',
        r'claim\s*settlement\s*ratio[:\-]\s*[\d\.]+%'
    ]
    
    claim_ratios = []
    for pattern in claim_ratio_patterns:
        matches = re.findall(pattern, soup.get_text(), re.IGNORECASE)
        claim_ratios.extend(matches)
    
    return {
        "type": "claim_ratio",
        "data": claim_ratios,
        "source": "scraped_content"
    }
