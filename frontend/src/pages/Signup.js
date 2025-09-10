import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import '../signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    state: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting signup with data:', {
        name: formData.name,
        email: formData.email,
        city: formData.city,
        state: formData.state
      });
      
      console.log('Making request to:', '/auth/register');
      
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        city: formData.city,
        state: formData.state
      });

      console.log('Signup successful:', response.data);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('restaurant', JSON.stringify(response.data.restaurant));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Error headers:', err.response?.headers);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === 'NETWORK_ERROR' || err.message.includes('Network Error')) {
        setError('Cannot connect to server. Please check if the backend is running.');
      } else {
        setError('An error occurred during signup. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-background"></div>
      <div className="signup-card">
        <div className="signup-header">
          <Link to="/" className="signup-back-link">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h2 className="signup-title">
            Create your restaurant account
          </h2>
          <p className="signup-subtitle">
            Already have an account?{' '}
            <Link to="/login" className="signup-link">
              Sign in here
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="signup-error">
            {error}
          </div>
        )}
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-form-group">
            <div className="signup-field-group">
              <label htmlFor="name" className="signup-label">
                Restaurant Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="signup-input"
                placeholder="Your restaurant name"
              />
            </div>
            
            <div className="signup-field-group">
              <label htmlFor="email" className="signup-label">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="signup-input"
                placeholder="your@email.com"
              />
            </div>
            
            <div className="signup-grid">
              <div className="signup-field-group">
                <label htmlFor="city" className="signup-label">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="City"
                />
              </div>
              <div className="signup-field-group">
                <label htmlFor="state" className="signup-label">
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="signup-input"
                  placeholder="State"
                />
              </div>
            </div>
            
            <div className="signup-field-group">
              <label htmlFor="password" className="signup-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="signup-input"
                placeholder="Create a password"
              />
            </div>
            
            <div className="signup-field-group">
              <label htmlFor="confirmPassword" className="signup-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="signup-input"
                placeholder="Confirm your password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="signup-submit"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          <div className="signup-terms">
            <p>
              By creating an account, you agree to our{' '}
              <a href="#" className="signup-terms-link">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="signup-terms-link">Privacy Policy</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
