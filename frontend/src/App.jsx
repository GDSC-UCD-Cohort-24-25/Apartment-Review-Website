import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';  // useLocation imported here
import Navbar from './Navbar';
import Home from './Home';  // Example Home component
import Login from './Login';  // Example Login component
import Sidebar from './Sidebar';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Content />
    </Router>
  );
}

function Content() {
  const location = useLocation();  // useLocation hook is now inside the Content component

  return (
    <div className="page-container">
      {location.pathname === '/' && <Sidebar />}  {/* Only show Sidebar on Home page */}
      <Routes>
        <Route path="/" element={<Home />} />  {/* Use element instead of component */}
        <Route path="/login" element={<Login />} />  {/* Use element instead of component */}
      </Routes>
    </div>
  );
}

export default App;
