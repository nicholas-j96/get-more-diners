import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import './components.css';

// Components
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Campaigns from './pages/Campaigns';
import AccountSettings from './pages/AccountSettings';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/diners" element={
            <>
              <Header />
              <main className="main-content">
                <Users />
              </main>
            </>
          } />
          <Route path="/users" element={
            <>
              <Header />
              <main className="main-content">
                <Users />
              </main>
            </>
          } />
          <Route path="/campaigns" element={
            <>
              <Header />
              <main className="main-content">
                <Campaigns />
              </main>
            </>
          } />
          <Route path="/account-settings" element={
            <>
              <Header />
              <main className="main-content">
                <AccountSettings />
              </main>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
