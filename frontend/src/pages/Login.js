import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import '../login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      console.log('Attempting login with email:', formData.email);
      
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log('Login successful:', response.data);

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('restaurant', JSON.stringify(response.data.restaurant));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('An error occurred during login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="login-back-link">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h2 className="login-title">
            Sign in to your account
          </h2>
          <p className="login-subtitle">
            Don't have an account?{' '}
            <Link to="/signup" className="login-link">
              Sign up here
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="login-error">
            {error}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-input-group">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              placeholder="Email address"
            />
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="login-input"
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
