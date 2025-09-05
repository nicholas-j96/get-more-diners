import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Campaigns from './pages/Campaigns';

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
          <Route path="/dashboard" element={
            <>
              <Header />
              <main className="main-content">
                <Dashboard />
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
