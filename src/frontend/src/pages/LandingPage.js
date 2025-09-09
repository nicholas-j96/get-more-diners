import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Mail, BarChart3, ArrowRight } from 'lucide-react';
import '../landing.css';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <Link to="/" className="nav-brand">
            Get More Diners
          </Link>
          <div className="nav-links">
            <Link to="/login" className="nav-link">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero">
        <div className="hero-background"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Reach More Diners,
            <span style={{ color: 'var(--color-primary)' }}> Grow Your Business</span>
          </h1>
          <p className="hero-subtitle">
            Create targeted marketing campaigns to reach diners based on their preferences, 
            location, and dining interests. Turn potential customers into loyal patrons.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features">
        <div className="features-container">
          <div className="features-header">
            <h2 className="features-title">
              Everything You Need to Market Your Restaurant
            </h2>
            <p className="features-subtitle">
              Powerful tools to help you connect with the right diners at the right time
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon primary">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="feature-title">Smart Diner Targeting</h3>
              <p className="feature-description">
                Filter diners by location, dining preferences, and seniority to create highly targeted campaigns.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon success">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="feature-title">Multi-Channel Campaigns</h3>
              <p className="feature-description">
                Send email and SMS campaigns to reach diners through their preferred communication channels.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon info">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="feature-title">Campaign Analytics</h3>
              <p className="feature-description">
                Track campaign performance and optimize your marketing strategy with detailed insights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta">
        <div className="cta-container">
          <h2 className="cta-title">
            Ready to Get More Diners?
          </h2>
          <p className="cta-subtitle">
            Join restaurants already using our platform to grow their customer base.
          </p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started Today
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <h3 className="footer-brand">Get More Diners</h3>
          <p className="footer-description">
            Helping restaurants connect with diners through smart marketing campaigns.
          </p>
          <div className="footer-links">
            <Link to="/login" className="footer-link">
              Sign In
            </Link>
            <Link to="/signup" className="footer-link">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
