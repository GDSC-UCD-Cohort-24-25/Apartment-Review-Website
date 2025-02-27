import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Listing from './pages/AllListing'; 
import Map from './pages/Mapview';
import Ranking from './pages/Ranking';
import About from './pages/About';
import Signup from './pages/Signup';
import Profile from './pages/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="page-container">
        {/* Render Sidebar for all pages */}
        <Sidebar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/listing" element={<Listing />} />
            <Route path="/map" element={<Map />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile/:userid" element={<Profile/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
