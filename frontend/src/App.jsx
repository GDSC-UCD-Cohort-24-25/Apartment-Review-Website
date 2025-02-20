import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./navbar.jsx";
import Home from "./home.jsx";
import Listing from "./listing.jsx";
import Map from "./map.jsx";
import Ranking from "./ranking.jsx";
import About from "./about.jsx";
import Contact from "./contact.jsx";
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing" element={<Listing />} />
        <Route path="/map" element={<Map />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;