import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request - Token:', token);
    console.log('API Request - URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('restaurant');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Campaign API functions
export const campaignAPI = {
  // Get all campaigns for the logged-in restaurant
  getAllCampaigns: () => api.get('/campaigns'),
  
  // Get a specific campaign by ID
  getCampaignById: (campaignId) => api.get(`/campaigns/${campaignId}`),
  
  // Create a new campaign
  createCampaign: (campaignData) => api.post('/campaigns', campaignData),
  
  // Update an existing campaign
  updateCampaign: (campaignId, campaignData) => api.patch(`/campaigns/${campaignId}`, campaignData),
  
  // Delete a campaign
  deleteCampaign: (campaignId) => api.delete(`/campaigns/${campaignId}`),
  
  // Get campaign recipients
  getCampaignRecipients: (campaignId) => api.get(`/campaigns/${campaignId}/recipients`),
  
  // Add diners to campaign
  addDinersToCampaign: (campaignId, dinerIds) => api.post(`/campaigns/${campaignId}/recipients`, { dinerIds }),
};

export default api;
