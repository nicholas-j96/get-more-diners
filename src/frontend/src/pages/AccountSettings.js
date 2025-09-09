import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { accountAPI } from '../utils/api';
import '../account-settings.css';

const AccountSettings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Load current user data
    const restaurant = JSON.parse(localStorage.getItem('restaurant') || '{}');
    setFormData(prev => ({
      ...prev,
      name: restaurant.name || '',
      email: restaurant.email || ''
    }));
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Only validate password fields if any password field is filled
    if (formData.currentPassword || formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required to change password';
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'New password must be at least 6 characters';
      }
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');

    try {
      // Update profile information
      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim()
      };

      // Add password change if provided
      if (formData.currentPassword && formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await accountAPI.updateProfile(updateData);
      // Update localStorage with new data
      const updatedRestaurant = {
        ...JSON.parse(localStorage.getItem('restaurant') || '{}'),
        name: formData.name.trim(),
        email: formData.email.trim()
      };
      localStorage.setItem('restaurant', JSON.stringify(updatedRestaurant));

      setSuccessMessage('Profile updated successfully!');
      
      // Clear password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Update profile error:', error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Failed to update profile. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      setErrors({ delete: 'Please type DELETE to confirm account deletion' });
      return;
    }

    setLoading(true);

    try {
      await accountAPI.deleteAccount();

      // Clear localStorage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('restaurant');
      navigate('/login');

    } catch (error) {
      console.error('Delete account error:', error);
      setErrors({ delete: 'Failed to delete account. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-settings-container">
      <h1 className="account-settings-title">Account Settings</h1>
      
      {successMessage && (
        <div className="account-settings-success">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="account-settings-error">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleUpdateProfile} className="account-settings-form">
        {/* Profile Information Section */}
        <div className="account-settings-card">
          <div className="account-settings-card-header">
            <h2 className="account-settings-card-title">
              <User className="h-5 w-5" />
              Profile Information
            </h2>
          </div>
          <div className="account-settings-card-body">
            <div className="account-settings-form-row">
              <div className="account-settings-form-field">
                <label htmlFor="name" className="account-settings-form-label">
                  <User className="h-4 w-4" />
                  Restaurant Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`account-settings-form-input ${errors.name ? 'error' : ''}`}
                  placeholder="Enter restaurant name"
                />
                {errors.name && <p className="account-settings-form-error">{errors.name}</p>}
              </div>

              <div className="account-settings-form-field">
                <label htmlFor="email" className="account-settings-form-label">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`account-settings-form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="account-settings-form-error">{errors.email}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Password Change Section */}
        <div className="account-settings-card">
          <div className="account-settings-card-header">
            <h2 className="account-settings-card-title">
              <Lock className="h-5 w-5" />
              Change Password
            </h2>
          </div>
          <div className="account-settings-card-body">
            <p className="account-settings-form-help">
              Leave password fields empty if you don't want to change your password.
            </p>
            
            <div className="account-settings-form-row">
              <div className="account-settings-form-field">
                <label htmlFor="currentPassword" className="account-settings-form-label">
                  Current Password
                </label>
                <div className="account-settings-form-input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className={`account-settings-form-input ${errors.currentPassword ? 'error' : ''}`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="account-settings-form-input-toggle"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && <p className="account-settings-form-error">{errors.currentPassword}</p>}
              </div>

              <div className="account-settings-form-field">
                <label htmlFor="newPassword" className="account-settings-form-label">
                  New Password
                </label>
                <div className="account-settings-form-input-group">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className={`account-settings-form-input ${errors.newPassword ? 'error' : ''}`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="account-settings-form-input-toggle"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && <p className="account-settings-form-error">{errors.newPassword}</p>}
              </div>

              <div className="account-settings-form-field">
                <label htmlFor="confirmPassword" className="account-settings-form-label">
                  Confirm New Password
                </label>
                <div className="account-settings-form-input-group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`account-settings-form-input ${errors.confirmPassword ? 'error' : ''}`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="account-settings-form-input-toggle"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="account-settings-form-error">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="account-settings-form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary account-settings-save-btn"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="account-settings-card account-settings-danger-card">
        <div className="account-settings-card-header">
          <h2 className="account-settings-card-title account-settings-danger-title">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </h2>
        </div>
        <div className="account-settings-card-body">
          <p className="account-settings-form-help">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <button
            onClick={() => setShowDeleteModal(true)}
            className="btn btn-danger"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Account</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="account-settings-modal-overlay">
          <div className="account-settings-modal">
            <div className="account-settings-modal-header">
              <Trash2 className="h-6 w-6 account-settings-modal-icon" />
              <h3 className="account-settings-modal-title">Delete Account</h3>
            </div>
            
            <p className="account-settings-modal-description">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
            
            <div className="account-settings-modal-form">
              <label htmlFor="deleteConfirm" className="account-settings-form-label">
                Type <span className="account-settings-danger-text">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                id="deleteConfirm"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="account-settings-form-input"
                placeholder="DELETE"
              />
              {errors.delete && <p className="account-settings-form-error">{errors.delete}</p>}
            </div>
            
            <div className="account-settings-modal-actions">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                  setErrors({});
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmText !== 'DELETE'}
                className="btn btn-danger"
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
