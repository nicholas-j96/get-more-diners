import React, { useState, useEffect } from 'react';
import { campaignAPI } from '../utils/api';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    subject: '',
    message: '',
    campaign_type: 'email'
  });

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [campaignDiners, setCampaignDiners] = useState([]);
  const [loadingDiners, setLoadingDiners] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      console.log('Fetching campaigns...');
      console.log('Token from localStorage:', localStorage.getItem('token'));
      console.log('Restaurant from localStorage:', localStorage.getItem('restaurant'));
      
      const response = await campaignAPI.getAllCampaigns();
      console.log('Campaigns response:', response.data);
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      console.error('Error response:', error.response?.data);
      // Handle error - could show a toast notification
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      console.log('Creating campaign with data:', newCampaign);
      const response = await campaignAPI.createCampaign(newCampaign);
      console.log('Campaign created successfully:', response.data);
      
      // Reset form and refresh campaigns list
      setNewCampaign({ name: '', subject: '', message: '', campaign_type: 'email' });
      setShowCreateForm(false);
      await fetchCampaigns(); // Refresh the campaigns list
    } catch (error) {
      console.error('Error creating campaign:', error);
      console.error('Error response:', error.response?.data);
      // Handle error - could show a toast notification
    }
  };

  const fetchCampaignDiners = async (campaignId) => {
    try {
      setLoadingDiners(true);
      console.log('Fetching diners for campaign:', campaignId);
      const response = await campaignAPI.getCampaignRecipients(campaignId);
      console.log('Campaign diners response:', response.data);
      setCampaignDiners(response.data);
    } catch (error) {
      console.error('Error fetching campaign diners:', error);
      console.error('Error response:', error.response?.data);
      setCampaignDiners([]);
    } finally {
      setLoadingDiners(false);
    }
  };

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setNewCampaign({
      name: campaign.name,
      subject: campaign.subject,
      message: campaign.message,
      campaign_type: campaign.campaign_type
    });
    setShowCreateForm(true);
    // Fetch diners for this campaign
    fetchCampaignDiners(campaign.id);
  };

  const handleUpdateCampaign = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating campaign with data:', newCampaign);
      const response = await campaignAPI.updateCampaign(editingCampaign.id, newCampaign);
      console.log('Campaign updated successfully:', response.data);
      
      // Reset form and refresh campaigns list
      setNewCampaign({ name: '', subject: '', message: '', campaign_type: 'email' });
      setShowCreateForm(false);
      setEditingCampaign(null);
      await fetchCampaigns(); // Refresh the campaigns list
    } catch (error) {
      console.error('Error updating campaign:', error);
      console.error('Error response:', error.response?.data);
      // Handle error - could show a toast notification
    }
  };

  const handleCancelEdit = () => {
    setEditingCampaign(null);
    setNewCampaign({ name: '', subject: '', message: '', campaign_type: 'email' });
    setShowCreateForm(false);
    setCampaignDiners([]);
  };

  const handleSendMessage = async () => {
    if (!editingCampaign) {
      alert('No campaign selected for sending messages');
      return;
    }

    try {
      console.log(`🚀 Sending ${editingCampaign.campaign_type} messages for campaign:`, editingCampaign.name);
      
      const response = await campaignAPI.sendEmails(editingCampaign.id);
      console.log('✅ Send emails response:', response.data);
      
      alert(`Successfully sent ${response.data.recipients_sent} ${editingCampaign.campaign_type} messages!\n\nCampaign status: ${response.data.campaign_status}\nSent at: ${new Date(response.data.sent_at).toLocaleString()}\n\n⚠️ Note: ${response.data.warning}`);
      
      // Refresh campaigns to show updated status
      await fetchCampaigns();
      
      // Refresh campaign diners to show updated status
      if (editingCampaign) {
        await fetchCampaignDiners(editingCampaign.id);
      }
      
    } catch (error) {
      console.error('❌ Error sending messages:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error sending messages: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          {showCreateForm ? 'Cancel' : 'Create New Campaign'}
        </button>
      </div>

      {/* Create/Edit Campaign Form */}
      {showCreateForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          <form onSubmit={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Type
                </label>
                <select
                  value={newCampaign.campaign_type}
                  onChange={(e) => setNewCampaign({...newCampaign, campaign_type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                value={newCampaign.message}
                onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 h-32"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                {editingCampaign ? 'Update Campaign' : 'Save Campaign'}
              </button>
              <button
                type="button"
                onClick={handleSendMessage}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List or Diners List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {editingCampaign ? (
          // Show diners table when editing a campaign
          <div>
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Diners in "{editingCampaign.name}" Campaign
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {campaignDiners.length} diner{campaignDiners.length !== 1 ? 's' : ''} in this campaign
              </p>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loadingDiners ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Loading diners...
                    </td>
                  </tr>
                ) : campaignDiners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No diners added to this campaign yet.
                    </td>
                  </tr>
                ) : (
                  campaignDiners.map((diner) => (
                    <tr key={diner.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {diner.first_name} {diner.last_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {diner.email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {diner.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {diner.city}, {diner.state}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          diner.status === 'sent' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {diner.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Show campaigns table when not editing
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No campaigns found. Create your first campaign!
                  </td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr 
                    key={campaign.id}
                    onClick={() => handleEditCampaign(campaign)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {campaign.name}
                      </div>
                      <div className="text-sm text-gray-500">{campaign.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.campaign_type === 'email' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {campaign.campaign_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {campaign.recipient_count || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement view recipients functionality
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View Recipients
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
