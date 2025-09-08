import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Diners</h1>
      
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by city..."
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Search by state..."
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Search by interests..."
            value={filterInterests}
            onChange={(e) => setFilterInterests(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="relative">
            <select
              multiple
              value={selectedSeniorities}
              onChange={(e) => {
                const values = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedSeniorities(values);
              }}
              className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              size="3"
            >
              {seniorityOptions.map((seniority) => (
                <option key={seniority} value={seniority}>{seniority}</option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Hold Ctrl/Cmd to select multiple
            </div>
          </div>
        </div>
        
        {/* Search and Clear Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`px-6 py-2 text-sm font-medium rounded-md ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
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
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Clear All Filters
          </button>
        </div>
      </div>

      {/* Diners Table - Only show after search */}
      {hasSearched && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Select All Button */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={handleSelectAll}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    selectAll 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {selectAll ? 'Deselect All' : 'Select All'}
                </button>
                {selectedDiners.length > 0 && (
                  <span className="ml-3 text-sm text-gray-600">
                    {selectedDiners.length} diner{selectedDiners.length !== 1 ? 's' : ''} selected
                  </span>
                )}
              </div>
              
              {/* Center: Add to Campaign Button */}
              <div className="flex-1 flex justify-center">
                <button
                  onClick={() => {
                    if (selectedDiners.length === 0) {
                      alert('Please select diners to add to a campaign');
                      return;
                    }
                    const selectedDinerObjects = filteredDiners.filter(diner => selectedDiners.includes(diner.id));
                    handleAddToCampaign(selectedDinerObjects);
                  }}
                  className={`px-6 py-2 text-sm font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 ${
                    selectedDiners.length > 0 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-300 hover:bg-gray-400 text-gray-600'
                  }`}
                >
                  Add to Campaign {selectedDiners.length > 0 && `(${selectedDiners.length})`}
                </button>
              </div>
              
              <div className="flex items-center">
                {selectedDiners.length > 0 && (
                  <button
                    onClick={clearSelection}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectAll && filteredDiners.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seniority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Searching for diners...
                    </div>
                  </td>
                </tr>
              ) : filteredDiners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No diners found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDiners.map((diner) => (
                  <tr key={diner.id} className={selectedDiners.includes(diner.id) ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedDiners.includes(diner.id)}
                        onChange={() => handleDinerSelect(diner.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {diner.first_name} {diner.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{diner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        diner.seniority === 'Senior' ? 'bg-purple-100 text-purple-800' :
                        diner.seniority === 'Mid-level' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {diner.seniority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {diner.city}, {diner.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {diner.dining_interests?.map((interest, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        View Campaigns
                      </button>
                      <button 
                        onClick={() => handleAddToCampaign([diner])}
                        className="text-green-600 hover:text-green-900"
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
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500 mb-4">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Diners</h3>
          <p className="text-gray-500">
            Use the search filters above to find diners by location, interests, and seniority level.
          </p>
        </div>
      )}

      {/* Campaign Selection Modal */}
      {showCampaignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Add {dinersToAdd.length} Diner{dinersToAdd.length !== 1 ? 's' : ''} to Campaign{dinersToAdd.length !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Select existing campaigns or create a new one
              </p>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {loadingCampaigns ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-600">Loading campaigns...</span>
                </div>
              ) : campaigns.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No campaigns found. Create your first campaign!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {campaigns.map((campaign) => (
                    <div 
                      key={campaign.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedCampaigns.includes(campaign.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleCampaignToggle(campaign.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{campaign.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{campaign.subject}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              campaign.campaign_type === 'email' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {campaign.campaign_type.toUpperCase()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {campaign.recipient_count || 0} recipients
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <input
                            type="checkbox"
                            checked={selectedCampaigns.includes(campaign.id)}
                            onChange={() => handleCampaignToggle(campaign.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                onClick={handleCreateNewCampaign}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Add to New Campaign
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelCampaignModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToSelectedCampaigns}
                  disabled={selectedCampaigns.length === 0}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    selectedCampaigns.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
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
