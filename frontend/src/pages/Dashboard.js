import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Search, BarChart3, Plus } from 'lucide-react';
import { campaignAPI } from '../utils/api';
import '../dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    unique_diners: 0,
    active_campaigns: 0,
    messages_sent_this_month: 0
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const restaurantData = localStorage.getItem('restaurant');
    
    if (!token || !restaurantData) {
      navigate('/login');
      return;
    }

    try {
      setRestaurant(JSON.parse(restaurantData));
    } catch (error) {
      console.error('Error parsing restaurant data:', error);
      navigate('/login');
      return;
    }
    
    // Fetch dashboard statistics
    fetchDashboardStats();
    setLoading(false);
  }, [navigate]);

  const handleAccountSettings = () => {
    navigate('/account-settings');
  };

  const handleSearchDiners = () => {
    navigate('/diners');
  };

  const handleViewCampaigns = () => {
    navigate('/campaigns');
  };

  const handleAddNewCampaign = () => {
    navigate('/campaigns');
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await campaignAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="dashboard-spinner">
          <div className="dashboard-spinner-icon"></div>
          <p className="dashboard-spinner-text">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header with Account Settings */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-inner">
            <div className="flex items-center">
              <button
                onClick={handleAccountSettings}
                className="dashboard-settings-btn"
              >
                <Settings className="h-6 w-6" />
                <span>Account Settings</span>
              </button>
            </div>
            
            <div className="dashboard-header-right">
              <h1 className="dashboard-welcome">
                Welcome, {restaurant?.name}
              </h1>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('restaurant');
                  navigate('/');
                }}
                className="dashboard-logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-hero">
          <h2 className="dashboard-hero-title">
            Restaurant Dashboard
          </h2>
          <p className="dashboard-hero-subtitle">
            Manage your diner outreach and marketing campaigns
          </p>
        </div>

        {/* Action Buttons */}
        <div className="dashboard-actions">
          {/* Search for Diners Button */}
          <button
            onClick={handleSearchDiners}
            className="dashboard-action-card"
          >
            <div className="dashboard-action-content">
              <div className="dashboard-action-icon search">
                <Search className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="dashboard-action-title">
                Search for Diners
              </h3>
              <p className="dashboard-action-description">
                Find and connect with potential diners in your area
              </p>
            </div>
          </button>

          {/* Add New Campaign Button */}
          <button
            onClick={handleAddNewCampaign}
            className="dashboard-action-card"
          >
            <div className="dashboard-action-content">
              <div className="dashboard-action-icon campaign">
                <Plus className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="dashboard-action-title">
                Add New Campaign
              </h3>
              <p className="dashboard-action-description">
                Create a new marketing campaign
              </p>
            </div>
          </button>

          {/* View Past Campaigns Button */}
          <button
            onClick={handleViewCampaigns}
            className="dashboard-action-card"
          >
            <div className="dashboard-action-content">
              <div className="dashboard-action-icon analytics">
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="dashboard-action-title">
                View Past Campaigns
              </h3>
              <p className="dashboard-action-description">
                Review and manage your marketing campaigns
              </p>
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="dashboard-stats">
          <div className="dashboard-stat-card">
            <h3 className="dashboard-stat-title">Total Diners</h3>
            <p className="dashboard-stat-value diners">{stats.unique_diners}</p>
            <p className="dashboard-stat-subtitle">In your campaigns</p>
          </div>
          
          <div className="dashboard-stat-card">
            <h3 className="dashboard-stat-title">Active Campaigns</h3>
            <p className="dashboard-stat-value campaigns">{stats.active_campaigns}</p>
            <p className="dashboard-stat-subtitle">Currently running</p>
          </div>
          
          <div className="dashboard-stat-card">
            <h3 className="dashboard-stat-title">Messages Sent</h3>
            <p className="dashboard-stat-value messages">{stats.messages_sent_this_month}</p>
            <p className="dashboard-stat-subtitle">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
