import React, { useState, useEffect } from 'react';
import { campaignAPI } from '../utils/api';
import AIAssistModal from '../components/AIAssistModal';

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
  const [preSelectedDiners, setPreSelectedDiners] = useState([]);
  const [showMessageHistory, setShowMessageHistory] = useState(false);
  const [messageHistory, setMessageHistory] = useState([]);
  const [loadingMessageHistory, setLoadingMessageHistory] = useState(false);
  const [showMessageDetail, setShowMessageDetail] = useState(false);
  const [messageDetail, setMessageDetail] = useState(null);
  const [loadingMessageDetail, setLoadingMessageDetail] = useState(false);
  const [showAIAssist, setShowAIAssist] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Check for pre-selected diners from Users page
  useEffect(() => {
    const storedDiners = localStorage.getItem('preSelectedDiners');
    if (storedDiners) {
      try {
        const diners = JSON.parse(storedDiners);
        setPreSelectedDiners(diners);
        setShowCreateForm(true); // Automatically open the form
        console.log('Pre-selected diners loaded:', diners);
      } catch (error) {
        console.error('Error parsing pre-selected diners:', error);
      }
    }
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
      
      // If there are pre-selected diners, add them to the campaign
      if (preSelectedDiners.length > 0) {
        console.log('Adding pre-selected diners to campaign:', preSelectedDiners);
        const dinerIds = preSelectedDiners.map(diner => diner.id);
        await campaignAPI.addDinersToCampaign(response.data.id, dinerIds);
        console.log('Pre-selected diners added to campaign');
        
        // Clear the pre-selected diners from localStorage and state
        localStorage.removeItem('preSelectedDiners');
        setPreSelectedDiners([]);
      }
      
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

  const handleAIGenerate = (aiContent) => {
    console.log('AI Generated Content:', aiContent);
    setNewCampaign({
      ...newCampaign,
      name: aiContent.campaignName,
      subject: aiContent.emailSubject,
      message: aiContent.emailText
    });
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
    // Clear pre-selected diners if canceling
    if (preSelectedDiners.length > 0) {
      localStorage.removeItem('preSelectedDiners');
      setPreSelectedDiners([]);
    }
  };

  const handleSendMessage = async () => {
    console.log('🔍 DEBUG: handleSendMessage called');
    console.log('🔍 DEBUG: editingCampaign:', editingCampaign);
    console.log('🔍 DEBUG: Stack trace:', new Error().stack);
    
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

  const handleViewMessageHistory = async () => {
    if (!editingCampaign) {
      alert('Please select a campaign to view message history');
      return;
    }

    try {
      setLoadingMessageHistory(true);
      const response = await campaignAPI.getMessageHistory(editingCampaign.id);
      setMessageHistory(response.data);
      setShowMessageHistory(true);
    } catch (error) {
      console.error('Error fetching message history:', error);
      alert('Error fetching message history: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingMessageHistory(false);
    }
  };

  const handleMessageClick = async (messageId) => {
    try {
      setLoadingMessageDetail(true);
      const response = await campaignAPI.getMessageDetail(messageId);
      setMessageDetail(response.data);
      setShowMessageDetail(true);
    } catch (error) {
      console.error('Error fetching message detail:', error);
      alert('Error fetching message details: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoadingMessageDetail(false);
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
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAIAssist(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>AI Assist</span>
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  {editingCampaign ? 'Update Campaign' : 'Save Campaign'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    console.log('🔍 DEBUG: Send Message button clicked');
                    console.log('🔍 DEBUG: Event:', e);
                    console.log('🔍 DEBUG: Event target:', e.target);
                    handleSendMessage();
                  }}
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
              <button
                type="button"
                onClick={handleViewMessageHistory}
                disabled={loadingMessageHistory}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-md"
              >
                {loadingMessageHistory ? 'Loading...' : 'View Past Messages'}
              </button>
            </div>
          </form>
          
          {/* Show pre-selected diners table when creating new campaign with pre-selected diners */}
          {!editingCampaign && preSelectedDiners.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Pre-selected Diners ({preSelectedDiners.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {preSelectedDiners.map((diner) => (
                      <tr key={diner.id}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {diner.first_name} {diner.last_name}
                          </div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {diner.email || 'N/A'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {diner.phone || 'N/A'}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                          {diner.city}, {diner.state}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
                          {diner.status === 'sent' 
                            ? `${diner.messages_sent || 1} message${(diner.messages_sent || 1) !== 1 ? 's' : ''} sent`
                            : (diner.status || 'pending')
                          }
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

      {/* Message History Modal */}
      {showMessageHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Message History - {editingCampaign?.name}</h2>
              <button
                onClick={() => setShowMessageHistory(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {messageHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No messages have been sent for this campaign yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messageHistory.map((message, index) => (
                  <div 
                    key={message.id} 
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleMessageClick(message.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-blue-600 hover:text-blue-800">
                        {message.subject}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(message.sent_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Recipients:</span> {message.recipient_count}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Open Rate:</span> {(message.open_rate * 100).toFixed(1)}% | 
                      <span className="font-medium ml-2">Click Rate:</span> {(message.click_rate * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Click to view details
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowMessageHistory(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {showMessageDetail && messageDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Message Details</h2>
              <button
                onClick={() => setShowMessageDetail(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Message Header */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{messageDetail.subject}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Sent:</span>
                    <p className="text-gray-900">{new Date(messageDetail.sent_at).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Type:</span>
                    <p className="text-gray-900">{messageDetail.campaign_type.toUpperCase()}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Recipients:</span>
                    <p className="text-gray-900">{messageDetail.recipient_count}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Open Rate:</span>
                    <p className="text-green-600 font-semibold">{(messageDetail.open_rate * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="font-medium text-gray-600">Click Rate:</span>
                  <p className="text-blue-600 font-semibold">{(messageDetail.click_rate * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Message Content</h4>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="whitespace-pre-wrap text-gray-800">
                    {messageDetail.campaign_message}
                  </div>
                </div>
              </div>

              {/* Analytics Summary */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Performance Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round(messageDetail.recipient_count * messageDetail.open_rate)}
                    </div>
                    <div className="text-sm text-blue-800">Estimated Opens</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round(messageDetail.recipient_count * messageDetail.click_rate)}
                    </div>
                    <div className="text-sm text-green-800">Estimated Clicks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {((messageDetail.click_rate / messageDetail.open_rate) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-purple-800">Click-to-Open Rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowMessageDetail(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Assist Modal */}
      <AIAssistModal
        isOpen={showAIAssist}
        onClose={() => setShowAIAssist(false)}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
};

export default Campaigns;
