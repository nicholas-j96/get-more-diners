import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../diners.css';

const Users = () => {
  const navigate = useNavigate();
  const [diners, setDiners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterInterests, setFilterInterests] = useState('');
  const [selectedSeniorities, setSelectedSeniorities] = useState([]);
  const [seniorityOptions, setSeniorityOptions] = useState([]);
  const [selectedDiners, setSelectedDiners] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Campaign modal state
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState([]);
  const [dinersToAdd, setDinersToAdd] = useState([]);
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);

  // Define filteredDiners before useEffect hooks
  const filteredDiners = diners.filter(diner => {
    const matchesCity = !filterCity || diner.city.toLowerCase().includes(filterCity.toLowerCase());
    const matchesState = !filterState || diner.state.toLowerCase().includes(filterState.toLowerCase());
    const matchesInterests = !filterInterests || 
      diner.dining_interests?.some(interest => 
        interest.toLowerCase().includes(filterInterests.toLowerCase())
      );
    const matchesSeniority = selectedSeniorities.length === 0 || 
      selectedSeniorities.includes(diner.seniority);
    
    return matchesCity && matchesState && matchesInterests && matchesSeniority;
  });

  useEffect(() => {
    // Fetch seniority options on component mount
    fetchSeniorityOptions();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.diners-custom-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Update selectAll state when individual selections change
  useEffect(() => {
    if (filteredDiners.length === 0) {
      setSelectAll(false);
    } else {
      setSelectAll(selectedDiners.length === filteredDiners.length);
    }
  }, [selectedDiners, filteredDiners]);

  const fetchSeniorityOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await axios.get(apiUrl + '/diners/seniority-options', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setSeniorityOptions(response.data);
    } catch (error) {
      console.error('Error fetching seniority options:', error);
    }
  };

  const handleSeniorityChange = (seniority) => {
    setSelectedSeniorities(prev => 
      prev.includes(seniority) 
        ? prev.filter(s => s !== seniority)
        : [...prev, seniority]
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleDinerSelect = (dinerId) => {
    setSelectedDiners(prev => 
      prev.includes(dinerId) 
        ? prev.filter(id => id !== dinerId)
        : [...prev, dinerId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Deselect all
      setSelectedDiners([]);
      setSelectAll(false);
    } else {
      // Select all visible diners
      const allDinerIds = filteredDiners.map(diner => diner.id);
      setSelectedDiners(allDinerIds);
      setSelectAll(true);
    }
  };

  const clearSelection = () => {
    setSelectedDiners([]);
    setSelectAll(false);
  };

  // Campaign modal functions
  const fetchCampaigns = async () => {
    try {
      setLoadingCampaigns(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await axios.get(apiUrl + '/campaigns', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCampaigns(response.data);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleAddToCampaign = (dinerObjects) => {
    setDinersToAdd(dinerObjects);
    setSelectedCampaigns([]);
    setShowCampaignModal(true);
    fetchCampaigns();
  };

  const handleCampaignToggle = (campaignId) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId) 
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleAddToSelectedCampaigns = async () => {
    if (selectedCampaigns.length === 0) {
      alert('Please select at least one campaign');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const dinerIds = dinersToAdd.map(diner => diner.id);
      
      // Add diners to each selected campaign
      for (const campaignId of selectedCampaigns) {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
        await axios.post(apiUrl + `/campaigns/${campaignId}/recipients`, 
          { dinerIds: dinerIds },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      alert(`Successfully added ${dinersToAdd.length} diner${dinersToAdd.length !== 1 ? 's' : ''} to ${selectedCampaigns.length} campaign${selectedCampaigns.length !== 1 ? 's' : ''}!`);
      setShowCampaignModal(false);
      clearSelection();
    } catch (error) {
      console.error('Error adding diners to campaigns:', error);
      alert('Error adding diners to campaigns. Please try again.');
    }
  };

  const handleCreateNewCampaign = () => {
    // Store selected diners in localStorage for the campaigns page
    localStorage.setItem('preSelectedDiners', JSON.stringify(dinersToAdd));
    setShowCampaignModal(false);
    navigate('/campaigns');
  };

  const handleCancelCampaignModal = () => {
    setShowCampaignModal(false);
    setSelectedCampaigns([]);
    setDinersToAdd([]);
  };

  const handleSearch = async () => {
    setHasSearched(true);
    setLoading(true);
    clearSelection(); // Clear any previous selections when searching
    
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filterCity) params.append('city', filterCity);
      if (filterState) params.append('state', filterState);
      if (filterInterests) params.append('interests', filterInterests);
      if (selectedSeniorities.length > 0) {
        selectedSeniorities.forEach(seniority => params.append('seniority', seniority));
      }
      
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
      const response = await axios.get(apiUrl + `/diners?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setDiners(response.data);
    } catch (error) {
      console.error('Error searching diners:', error);
      setDiners([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="diners-container">
      <h1 className="diners-title">Diners</h1>
      
      {/* Search and Filters */}
      <div className="diners-search-card">
        <div className="diners-search-grid">
          <input
            type="text"
            placeholder="Search by city..."
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="diners-search-input"
          />
          <input
            type="text"
            placeholder="Search by state..."
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="diners-search-input"
          />
          <input
            type="text"
            placeholder="Search by interests..."
            value={filterInterests}
            onChange={(e) => setFilterInterests(e.target.value)}
            className="diners-search-input"
          />
          <div className="diners-select-container">
            <div className="diners-custom-dropdown">
              <div className="diners-dropdown-header" onClick={toggleDropdown}>
                <span className="diners-dropdown-label">
                  Filter by Level {selectedSeniorities.length > 0 && `(${selectedSeniorities.length})`}
                </span>
                <span className={`diners-dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>▼</span>
              </div>
              {isDropdownOpen && (
                <div className="diners-dropdown-content">
                  {seniorityOptions.map((seniority) => (
                    <label key={seniority} className="diners-dropdown-option">
                      <input
                        type="checkbox"
                        checked={selectedSeniorities.includes(seniority)}
                        onChange={() => handleSeniorityChange(seniority)}
                        className="diners-dropdown-checkbox"
                      />
                      <span className="diners-dropdown-text">{seniority}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search and Clear Buttons */}
        <div className="diners-search-actions">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`diners-search-btn ${loading ? 'primary disabled' : 'primary'}`}
          >
            {loading ? 'Searching...' : 'Search Diners'}
          </button>
          
          <button
            onClick={() => {
              setFilterCity('');
              setFilterState('');
              setFilterInterests('');
              setSelectedSeniorities([]);
              setHasSearched(false);
              setDiners([]);
              clearSelection();
            }}
            className="diners-search-btn secondary"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Diners Table - Only show after search */}
      {hasSearched && (
        <div className="diners-table-card">
          {/* Select All Button */}
          <div className="diners-table-header">
            <div className="diners-table-header-inner">
              <div className="diners-table-header-left">
                <button
                  onClick={handleSelectAll}
                  className={`diners-select-all-btn ${selectAll ? 'danger' : 'primary'}`}
                >
                  {selectAll ? 'Deselect All' : 'Select All'}
                </button>
                {selectedDiners.length > 0 && (
                  <span className="diners-selection-count">
                    {selectedDiners.length} diner{selectedDiners.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              
              {/* Center: Add to Campaign Button */}
              <div className="diners-table-header-center">
                <button
                  onClick={() => {
                    if (selectedDiners.length === 0) {
                      alert('Please select diners to add to a campaign');
                      return;
                    }
                    const selectedDinerObjects = filteredDiners.filter(diner => selectedDiners.includes(diner.id));
                    handleAddToCampaign(selectedDinerObjects);
                  }}
                  className={`diners-add-campaign-btn ${selectedDiners.length > 0 ? 'success' : 'disabled'}`}
                >
                  Add to Campaign {selectedDiners.length > 0 && `(${selectedDiners.length})`}
                </button>
              </div>
              
              <div className="diners-table-header-right">
                {selectedDiners.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="diners-clear-btn"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <table className="diners-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectAll && filteredDiners.length > 0}
                    onChange={handleSelectAll}
                    className="diners-checkbox"
                  />
                </th>
                <th>Name</th>
                <th>Seniority</th>
                <th>Location</th>
                <th>Interests</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="diners-loading">
                    <div className="diners-loading-spinner"></div>
                    Searching for diners...
                  </td>
                </tr>
              ) : filteredDiners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="diners-empty">
                    No diners found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDiners.map((diner) => (
                  <tr key={diner.id} className={selectedDiners.includes(diner.id) ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedDiners.includes(diner.id)}
                        onChange={() => handleDinerSelect(diner.id)}
                        className="diners-checkbox"
                      />
                    </td>
                    <td>
                      <div className="diners-name">
                        {diner.first_name} {diner.last_name}
                      </div>
                      <div className="diners-email">{diner.email}</div>
                    </td>
                    <td>
                      <span className={`diners-seniority-badge ${
                        diner.seniority === 'Senior' ? 'senior' :
                        diner.seniority === 'Mid-level' ? 'mid' :
                        'junior'
                      }`}>
                        {diner.seniority}
                      </span>
                    </td>
                    <td className="diners-location">
                      {diner.city}, {diner.state}
                    </td>
                    <td>
                      <div className="diners-interests">
                        {diner.dining_interests?.map((interest, index) => (
                          <span key={index} className="diners-interest-tag">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="diners-actions">
                      <button className="diners-action-btn">
                        View Campaigns
                      </button>
                      <button 
                        onClick={() => handleAddToCampaign([diner])}
                        className="diners-action-btn success"
                      >
                        Add to Campaign
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Initial State Message */}
      {!hasSearched && (
        <div className="diners-empty-state">
          <div className="diners-empty-icon">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="diners-empty-title">Search for Diners</h3>
          <p className="diners-empty-description">
            Use the search filters above to find diners by location, interests, and seniority level.
          </p>
        </div>
      )}

      {/* Campaign Selection Modal */}
      {showCampaignModal && (
        <div className="diners-modal-overlay">
          <div className="diners-modal">
            {/* Modal Header */}
            <div className="diners-modal-header">
              <h3 className="diners-modal-title">
                Add {dinersToAdd.length} Diner{dinersToAdd.length !== 1 ? 's' : ''} to Campaign{dinersToAdd.length !== 1 ? 's' : ''}
              </h3>
              <p className="diners-modal-subtitle">
                Select existing campaigns or create a new one
              </p>
            </div>

            {/* Modal Content */}
            <div className="diners-modal-content">
              {loadingCampaigns ? (
                <div className="diners-modal-loading">
                  <div className="diners-modal-loading-spinner"></div>
                  <span className="diners-modal-loading-text">Loading campaigns...</span>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="diners-modal-empty">
                  <p className="diners-modal-empty-text">No campaigns found. Create your first campaign!</p>
                </div>
              ) : (
                <div className="diners-campaign-list">
                  {campaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className={`diners-campaign-item ${
                        selectedCampaigns.includes(campaign.id) ? 'selected' : ''
                      }`}
                      onClick={() => handleCampaignToggle(campaign.id)}
                    >
                      <div className="diners-campaign-content">
                        <div className="diners-campaign-info">
                          <h4 className="diners-campaign-name">{campaign.name}</h4>
                          <p className="diners-campaign-subject">{campaign.subject}</p>
                          <div className="diners-campaign-meta">
                            <span className={`diners-campaign-type ${campaign.campaign_type}`}>
                              {campaign.campaign_type.toUpperCase()}
                            </span>
                            <span className="diners-campaign-count">
                              {campaign.recipient_count || 0} recipients
                            </span>
                          </div>
                        </div>
                        <div>
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.includes(campaign.id)}
                            onChange={() => handleCampaignToggle(campaign.id)}
                            className="diners-campaign-checkbox"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="diners-modal-footer">
              <button
                onClick={handleCreateNewCampaign}
                className="diners-modal-btn primary"
              >
                Add to New Campaign
              </button>
              
              <div className="diners-modal-actions">
                <button
                  onClick={handleCancelCampaignModal}
                  className="diners-modal-btn secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToSelectedCampaigns}
                  disabled={selectedCampaigns.length === 0}
                  className={`diners-modal-btn ${selectedCampaigns.length === 0 ? 'disabled' : 'success'}`}
                >
                  Add to Selected ({selectedCampaigns.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
