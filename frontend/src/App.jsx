import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from "./Auth";
import { ApartmentProvider } from "./ApartmentProvider";

import Navbar from './components/Navbar';
import Home from './pages/home';
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
import Quiz from './pages/Quiz';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <ApartmentProvider>
        <Router>
          <Navbar />
          <MainContent />
        </Router>
      </ApartmentProvider>
    </AuthProvider>
  );
}

function MainContent() {
  const location = useLocation();
  const disablePadding = location.pathname === '/map';

  const sidebarHidden =
    location.pathname === "/login" ||
    location.pathname === "/signup" 

  return (
  <div className={`page-container ${sidebarHidden ? 'no-sidebar' : ''} ${disablePadding ? 'no-padding' : ''}`}>
      {!sidebarHidden && <Sidebar />}

      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/listing" element={<Listing />} />
          <Route path="/map" element={<Map />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/apartment/:id" element={<Apartment />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;