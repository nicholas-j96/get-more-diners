import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

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
  
  // Send emails/SMS to all campaign recipients
  sendEmails: (campaignId) => api.post(`/campaigns/${campaignId}/send`),
  
  // Get dashboard statistics
  getDashboardStats: () => api.get('/campaigns/dashboard/stats'),
  
  // Get message history for a campaign
  getMessageHistory: (campaignId) => api.get(`/campaigns/${campaignId}/message-history`),
  
  // Get detailed message data
  getMessageDetail: (messageId) => api.get(`/campaigns/message/${messageId}`),
};

// AI API functions
export const aiAPI = {
  // Generate campaign content using AI
  generateCampaignContent: (description) => api.post('/ai/campaign/generate', { campaignDescription: description }),
};

// Account API functions
export const accountAPI = {
  // Get current user profile
  getProfile: () => api.get('/auth/profile'),
  
  // Update account settings (name, email, password)
  updateProfile: (data) => api.patch('/auth/profile', data),
  
  // Delete account
  deleteAccount: () => api.delete('/auth/account'),
};

export default api;
