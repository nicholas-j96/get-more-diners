import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/dashboard">Get More Diners</Link>
        </h1>
        <nav className="space-x-4">
          <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
          <Link to="/users" className="hover:text-blue-200">Diners</Link>
          <Link to="/campaigns" className="hover:text-blue-200">Campaigns</Link>
          <Link to="/account-settings" className="hover:text-blue-200">Account Settings</Link>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
