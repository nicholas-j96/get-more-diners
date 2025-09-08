import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { aiAPI } from '../utils/api';

const AIAssistModal = ({ isOpen, onClose, onGenerate }) => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!description.trim()) {
      setError('Please describe your campaign');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await aiAPI.generateCampaignContent(description);
      onGenerate(response.data);
      
      // Close the modal
      onClose();
      
      // Clear the form
      setDescription('');
      
    } catch (err) {
      console.error('AI Generation Error:', err);
      setError('Failed to generate campaign content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">AI Campaign Assistant</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Describe Your Campaign
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tell us about your campaign in natural language. Include details like:
            </p>
            <ul className="text-sm text-gray-600 list-disc list-inside space-y-1 mb-4">
              <li>Type of offer (discount, special event, promotion)</li>
              <li>Discount percentage or specific deal</li>
              <li>Target audience or occasion</li>
              <li>Time period or urgency</li>
              <li>Any special terms or conditions</li>
            </ul>
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 'Happy Hour special with 20% off all drinks and appetizers from 4-6 PM weekdays. Perfect for after-work gatherings and date nights.'"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={6}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Example */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Example:</h4>
            <p className="text-sm text-blue-800 italic">
              "Weekend brunch special: 15% off all breakfast items and bottomless mimosas for $12. 
              Available Saturdays and Sundays 10 AM - 2 PM. Perfect for families and groups. 
              Limited time offer valid this month only."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIAssistModal;
