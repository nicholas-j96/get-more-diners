import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Users = () => {
  const [diners, setDiners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filterCity, setFilterCity] = useState('');
  const [filterState, setFilterState] = useState('');
  const [filterInterests, setFilterInterests] = useState('');
  const [selectedSeniorities, setSelectedSeniorities] = useState([]);
  const [seniorityOptions, setSeniorityOptions] = useState([]);

  useEffect(() => {
    // Fetch seniority options on component mount
    fetchSeniorityOptions();
  }, []);

  const fetchSeniorityOptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/diners/seniority-options', {
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

  const handleSearch = async () => {
    setHasSearched(true);
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (filterCity) params.append('city', filterCity);
      if (filterState) params.append('state', filterState);
      if (filterInterests) params.append('interests', filterInterests);
      if (selectedSeniorities.length > 0) {
        selectedSeniorities.forEach(seniority => params.append('seniority', seniority));
      }
      
      const response = await axios.get(`http://localhost:3001/api/diners?${params.toString()}`, {
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                      Searching for diners...
                    </div>
                  </td>
                </tr>
              ) : filteredDiners.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No diners found matching your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDiners.map((diner) => (
                  <tr key={diner.id}>
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
                      <button className="text-green-600 hover:text-green-900">
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
    </div>
  );
};

export default Users;
