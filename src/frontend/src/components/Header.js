import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../header.css';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="header-brand">
          <Link to="/dashboard">Get More Diners</Link>
        </h1>
        <nav className="header-nav">
          <Link to="/dashboard" className="header-nav-link">Dashboard</Link>
          <Link to="/users" className="header-nav-link">Diners</Link>
          <Link to="/campaigns" className="header-nav-link">Campaigns</Link>
          <Link to="/account-settings" className="header-nav-link">Account Settings</Link>
          <button 
            onClick={handleLogout}
            className="header-logout-btn"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
