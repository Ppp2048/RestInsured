// RestInsured Frontend API Service
// Handles all communication with the backend API

const API_BASE_URL = 'http://127.0.0.1:8000/api';

class RestInsuredAPI {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // AI Analysis endpoint
    async analyzeInsurance(prompt) {
        return this.request('/analyze', {
            method: 'POST',
            body: JSON.stringify({ prompt }),
        });
    }

    // ML Premium Prediction endpoint
    async predictPremium(userData) {
        return this.request('/predict', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    // Web Scraping endpoint
    async scrapeInsuranceData(providerUrl, dataType = 'premium') {
        return this.request('/scrape', {
            method: 'POST',
            body: JSON.stringify({ 
                provider_url: providerUrl, 
                data_type: dataType 
            }),
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/analyze', {
            method: 'GET',
        });
    }
}

// Create global API instance
const api = new RestInsuredAPI();

// Legacy function for backward compatibility with existing BimaSetu code
async function callBackend(prompt) {
    try {
        const response = await api.analyzeInsurance(prompt);
        return response.data;
    } catch (error) {
        console.error('Backend call failed:', error);
        throw error;
    }
}

// Premium prediction function
async function predictPremium(userData) {
    try {
        const response = await api.predictPremium(userData);
        return response;
    } catch (error) {
        console.error('Premium prediction failed:', error);
        throw error;
    }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { api, callBackend, predictPremium };
}
