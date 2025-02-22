import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Home';
import Login from './Login';
import Sidebar from './Sidebar';
import Listing from './AllListing'; 
import Map from './Mapview';
import Ranking from './Ranking';
import About from './About';

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
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
