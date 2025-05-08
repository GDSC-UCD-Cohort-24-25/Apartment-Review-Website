import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
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
import WriteReview from './pages/writeReview';
import Apartment from './pages/Apartment';

import './App.css';

const Layout = ({ children }) => {
  const location = useLocation();
  const hideSidebar = location.pathname === '/listings'; // Hide sidebar on All Listings page

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        {!hideSidebar && <Sidebar />} {/* Sidebar only hides on /listings */}
        <main className="content">{children}</main>
      </div>
    </div>
  );
};

function App() {
  
  return (
    <Router>
      <Navbar />
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation(); // Get current route

  return (
    <div className="page-container">
      {/* Conditionally render Sidebar (hide on login page) */}
      {location.pathname !== "/login" && location.pathname !== "/signup" && <Sidebar />} 

      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/map" element={<Map />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:userid" element={<Profile />} />
          <Route path="/write-review" element={<WriteReview />} />

          <Route path="/apartment/:id" element={<Apartment />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;