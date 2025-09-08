import React, { useState, useEffect } from 'react';
import { campaignAPI } from '../utils/api';
import AIAssistModal from '../components/AIAssistModal';
import '../campaigns.css';

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
    <div className="campaigns-container">
      <div className="campaigns-header">
        <h1 className="campaigns-title">Campaigns</h1>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="campaigns-create-btn"
        >
          {showCreateForm ? 'Cancel' : 'Create New Campaign'}
        </button>
      </div>

      {/* Create/Edit Campaign Form */}
      {showCreateForm && (
        <div className="campaigns-form-card">
          <h2 className="campaigns-form-title">
            {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
          </h2>
          <form onSubmit={editingCampaign ? handleUpdateCampaign : handleCreateCampaign}>
            <div className="campaigns-form-grid">
              <div className="campaigns-form-group">
                <label className="campaigns-form-label">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                  className="campaigns-form-input"
                  required
                />
              </div>
              <div className="campaigns-form-group">
                <label className="campaigns-form-label">
                  Campaign Type
                </label>
                <select
                  value={newCampaign.campaign_type}
                  onChange={(e) => setNewCampaign({...newCampaign, campaign_type: e.target.value})}
                  className="campaigns-form-select"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>
            <div className="campaigns-form-group">
              <label className="campaigns-form-label">
                Subject
              </label>
              <input
                type="text"
                value={newCampaign.subject}
                onChange={(e) => setNewCampaign({...newCampaign, subject: e.target.value})}
                className="campaigns-form-input"
                required
              />
            </div>
            <div className="campaigns-form-group">
              <label className="campaigns-form-label">
                Message
              </label>
              <textarea
                value={newCampaign.message}
                onChange={(e) => setNewCampaign({...newCampaign, message: e.target.value})}
                className="campaigns-form-textarea"
                required
              />
            </div>
            <div className="campaigns-form-actions">
              <button
                type="button"
                onClick={() => setShowAIAssist(true)}
                className="campaigns-form-btn primary"
              >
                <svg className="ai-assist-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Assist
              </button>
              <button
                type="submit"
                className="campaigns-form-btn success"
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
                className="campaigns-form-btn send"
              >
                Send Message
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="campaigns-form-btn secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleViewMessageHistory}
                disabled={loadingMessageHistory}
                className={`campaigns-form-btn ${loadingMessageHistory ? 'secondary disabled' : 'info'}`}
              >
                {loadingMessageHistory ? 'Loading...' : 'View Past Messages'}
              </button>
            </div>
          </form>
          
          {/* Show pre-selected diners table when creating new campaign with pre-selected diners */}
          {!editingCampaign && preSelectedDiners.length > 0 && (
            <div className="campaigns-diners-section">
              <div className="campaigns-diners-header">
                <h3 className="campaigns-diners-title">
                  Pre-selected Diners ({preSelectedDiners.length})
                </h3>
              </div>
              <div className="campaigns-diners-content">
                <div className="campaigns-diners-list">
                  {preSelectedDiners.map((diner) => (
                    <div key={diner.id} className="campaigns-diner-item">
                      <div className="campaigns-diner-info">
                        <div className="campaigns-diner-name">
                          {diner.first_name} {diner.last_name}
                        </div>
                        <div className="campaigns-diner-email">
                          {diner.email || 'N/A'} • {diner.phone || 'N/A'} • {diner.city}, {diner.state}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Campaigns List or Diners List */}
      <div className="campaigns-list">
        {editingCampaign ? (
          // Show diners table when editing a campaign
          <div className="campaigns-diners-section">
            <div className="campaigns-diners-header">
              <h3 className="campaigns-diners-title">
                Diners in "{editingCampaign.name}" Campaign
              </h3>
              <p className="campaigns-diners-subtitle">
                {campaignDiners.length} diner{campaignDiners.length !== 1 ? 's' : ''} in this campaign
              </p>
            </div>
            <table className="campaigns-recipients-table">
              <thead className="campaigns-recipients-thead">
                <tr>
                  <th className="campaigns-recipients-th">
                    Name
                  </th>
                  <th className="campaigns-recipients-th">
                    Email
                  </th>
                  <th className="campaigns-recipients-th">
                    Phone
                  </th>
                  <th className="campaigns-recipients-th">
                    Location
                  </th>
                  <th className="campaigns-recipients-th">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="campaigns-recipients-tbody">
                {loadingDiners ? (
                  <tr>
                    <td colSpan="5" className="campaigns-recipients-td campaigns-recipients-td-empty">
                      Loading diners...
                    </td>
                  </tr>
                ) : campaignDiners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="campaigns-recipients-td campaigns-recipients-td-empty">
                      No diners added to this campaign yet.
                    </td>
                  </tr>
                ) : (
                  campaignDiners.map((diner) => (
                    <tr key={diner.id} className="campaigns-recipients-tr">
                      <td className="campaigns-recipients-td">
                        <div className="campaigns-recipients-name">
                          {diner.first_name} {diner.last_name}
                        </div>
                      </td>
                      <td className="campaigns-recipients-td">
                        {diner.email || 'N/A'}
                      </td>
                      <td className="campaigns-recipients-td">
                        {diner.phone || 'N/A'}
                      </td>
                      <td className="campaigns-recipients-td">
                        {diner.city}, {diner.state}
                      </td>
                      <td className="campaigns-recipients-td">
                        <span className={`campaigns-recipients-status ${
                          diner.status === 'sent' 
                            ? 'campaigns-recipients-status-sent' 
                            : 'campaigns-recipients-status-pending'
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
          // Show campaigns list when not editing
          <>
            {loading ? (
              <div className="campaigns-loading">
                <div className="campaigns-loading-spinner"></div>
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="campaigns-empty">
                <div className="campaigns-empty-icon">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="campaigns-empty-title">No campaigns found</h3>
                <p className="campaigns-empty-description">Create your first campaign to get started!</p>
              </div>
            ) : (
              campaigns.map((campaign) => (
                <div key={campaign.id} className="campaigns-item">
                  <div className="campaigns-item-header">
                    <h3 className="campaigns-item-title">{campaign.name}</h3>
                    <p className="campaigns-item-subtitle">{campaign.subject}</p>
                    <div className="campaigns-item-meta">
                      <span className={`campaigns-item-type ${campaign.campaign_type}`}>
                        {campaign.campaign_type.toUpperCase()}
                      </span>
                      <span className="campaigns-item-count">
                        {campaign.recipient_count || 0} recipients
                      </span>
                      <span className="campaigns-item-count">
                        Created {new Date(campaign.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="campaigns-item-body">
                    <p className="campaigns-item-message">{campaign.message}</p>
                    <div className="campaigns-item-actions">
                      <button 
                        onClick={() => handleEditCampaign(campaign)}
                        className="campaigns-action-btn primary"
                      >
                        Edit Campaign
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement view recipients functionality
                        }}
                        className="campaigns-action-btn secondary"
                      >
                        View Recipients
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement delete functionality
                        }}
                        className="campaigns-action-btn secondary"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* Message History Modal */}
      {showMessageHistory && (
        <div className="message-history-modal-overlay">
          <div className="message-history-modal">
            <div className="message-history-modal-header">
              <h2 className="message-history-modal-title">Message History - {editingCampaign?.name}</h2>
              <button
                onClick={() => setShowMessageHistory(false)}
                className="message-history-modal-close"
              >
                ×
              </button>
            </div>
            
            {messageHistory.length === 0 ? (
              <div className="message-history-empty">
                <p>No messages have been sent for this campaign yet.</p>
              </div>
            ) : (
              <div className="message-history-list">
                {messageHistory.map((message, index) => (
                  <div 
                    key={message.id} 
                    className="message-history-item"
                    onClick={() => handleMessageClick(message.id)}
                  >
                    <div className="message-history-item-header">
                      <h3 className="message-history-item-title">
                        {message.subject}
                      </h3>
                      <span className="message-history-item-date">
                        {new Date(message.sent_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="message-history-item-stats">
                      <span className="message-history-item-stats-label">Recipients:</span> {message.recipient_count}
                    </div>
                    <div className="message-history-item-stats">
                      <span className="message-history-item-stats-label">Open Rate:</span> {(message.open_rate * 100).toFixed(1)}% | 
                      <span className="message-history-item-stats-label"> Click Rate:</span> {(message.click_rate * 100).toFixed(1)}%
                    </div>
                    <div className="message-history-item-hint">
                      Click to view details
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="message-history-modal-footer">
              <button
                onClick={() => setShowMessageHistory(false)}
                className="campaigns-form-btn info"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Detail Modal */}
      {showMessageDetail && messageDetail && (
        <div className="message-detail-modal-overlay">
          <div className="message-detail-modal">
            <div className="message-detail-modal-header">
              <h2 className="message-detail-modal-title">Message Details</h2>
              <button
                onClick={() => setShowMessageDetail(false)}
                className="message-detail-modal-close"
              >
                ×
              </button>
            </div>
            
            <div className="message-detail-content">
              {/* Message Header */}
              <div className="message-detail-header">
                <h3 className="message-detail-subject">{messageDetail.subject}</h3>
                <div className="message-detail-stats-grid">
                  <div className="message-detail-stat">
                    <span className="message-detail-stat-label">Sent:</span>
                    <p className="message-detail-stat-value">{new Date(messageDetail.sent_at).toLocaleString()}</p>
                  </div>
                  <div className="message-detail-stat">
                    <span className="message-detail-stat-label">Type:</span>
                    <p className="message-detail-stat-value">{messageDetail.campaign_type.toUpperCase()}</p>
                  </div>
                  <div className="message-detail-stat">
                    <span className="message-detail-stat-label">Recipients:</span>
                    <p className="message-detail-stat-value">{messageDetail.recipient_count}</p>
                  </div>
                  <div className="message-detail-stat">
                    <span className="message-detail-stat-label">Open Rate:</span>
                    <p className="message-detail-stat-value success">{(messageDetail.open_rate * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="message-detail-click-rate">
                  <span className="message-detail-stat-label">Click Rate:</span>
                  <p className="message-detail-stat-value primary">{(messageDetail.click_rate * 100).toFixed(1)}%</p>
                </div>
              </div>

              {/* Message Content */}
              <div className="message-detail-section">
                <h4 className="message-detail-section-title">Message Content</h4>
                <div className="message-detail-content-box">
                  <div className="message-detail-message-text">
                    {messageDetail.campaign_message}
                  </div>
                </div>
              </div>

              {/* Analytics Summary */}
              <div className="message-detail-analytics">
                <h4 className="message-detail-analytics-title">Performance Summary</h4>
                <div className="message-detail-analytics-grid">
                  <div className="message-detail-analytics-item">
                    <div className="message-detail-analytics-number">
                      {Math.round(messageDetail.recipient_count * messageDetail.open_rate)}
                    </div>
                    <div className="message-detail-analytics-label">Estimated Opens</div>
                  </div>
                  <div className="message-detail-analytics-item">
                    <div className="message-detail-analytics-number success">
                      {Math.round(messageDetail.recipient_count * messageDetail.click_rate)}
                    </div>
                    <div className="message-detail-analytics-label">Estimated Clicks</div>
                  </div>
                  <div className="message-detail-analytics-item">
                    <div className="message-detail-analytics-number purple">
                      {((messageDetail.click_rate / messageDetail.open_rate) * 100).toFixed(1)}%
                    </div>
                    <div className="message-detail-analytics-label">Click-to-Open Rate</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="message-detail-modal-footer">
              <button
                onClick={() => setShowMessageDetail(false)}
                className="campaigns-form-btn info"
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
