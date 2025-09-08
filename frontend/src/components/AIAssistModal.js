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
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        {/* Header */}
        <div className="ai-modal-header">
          <div className="ai-modal-header-content">
            <Sparkles className="ai-modal-icon" />
            <h2 className="ai-modal-title">AI Campaign Assistant</h2>
          </div>
          <button
            onClick={handleClose}
            className="ai-modal-close-btn"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="ai-modal-body">
          <div className="ai-modal-section">
            <h3 className="ai-modal-section-title">
              Describe Your Campaign
            </h3>
            <p className="ai-modal-section-description">
              Tell us about your campaign in natural language. Include details like:
            </p>
            <ul className="ai-modal-list">
              <li>Type of offer (discount, special event, promotion)</li>
              <li>Discount percentage or specific deal</li>
              <li>Target audience or occasion</li>
              <li>Time period or urgency</li>
              <li>Any special terms or conditions</li>
            </ul>
          </div>

          <div className="ai-modal-section">
            <label htmlFor="description" className="ai-modal-label">
              Campaign Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., 'Happy Hour special with 20% off all drinks and appetizers from 4-6 PM weekdays. Perfect for after-work gatherings and date nights.'"
              className="ai-modal-textarea"
              rows={6}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="ai-modal-error">
              {error}
            </div>
          )}

          {/* Example */}
          <div className="ai-modal-example">
            <h4 className="ai-modal-example-title">Example:</h4>
            <p className="ai-modal-example-text">
              "Weekend brunch special: 15% off all breakfast items and bottomless mimosas for $12. 
              Available Saturdays and Sundays 10 AM - 2 PM. Perfect for families and groups. 
              Limited time offer valid this month only."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="ai-modal-footer">
          <button
            onClick={handleClose}
            disabled={loading}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !description.trim()}
            className="btn btn-primary ai-modal-generate-btn"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 ai-modal-spinner" />
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
