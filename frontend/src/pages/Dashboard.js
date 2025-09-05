import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Search, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

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
    
    setLoading(false);
  }, [navigate]);

  const handleAccountSettings = () => {
    // TODO: Navigate to account settings page
    console.log('Account settings clicked');
  };

  const handleSearchDiners = () => {
    navigate('/diners');
  };

  const handleViewCampaigns = () => {
    navigate('/campaigns');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Account Settings */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={handleAccountSettings}
                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Settings className="h-6 w-6" />
                <span className="text-sm font-medium">Account Settings</span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                Welcome, {restaurant?.name}
              </h1>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('restaurant');
                  navigate('/');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Restaurant Dashboard
          </h2>
          <p className="text-lg text-gray-600">
            Manage your diner outreach and marketing campaigns
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Search for Diners Button */}
          <button
            onClick={handleSearchDiners}
            className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-blue-300"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Search for Diners
              </h3>
              <p className="text-gray-600 text-center">
                Find and connect with potential diners in your area
              </p>
            </div>
          </button>

          {/* View Past Campaigns Button */}
          <button
            onClick={handleViewCampaigns}
            className="group relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-green-300"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                View Past Campaigns
              </h3>
              <p className="text-gray-600 text-center">
                Review and manage your marketing campaigns
              </p>
            </div>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Diners</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <p className="text-sm text-gray-500 mt-1">In your database</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Campaigns</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-500 mt-1">Currently running</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Messages Sent</h3>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
