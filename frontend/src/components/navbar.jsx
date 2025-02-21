import React from 'react';
import { Link } from 'react-router-dom';  // Using Link for navigation
import './Navbar.css';
//import { FaUser } from 'react-icons/fa';  // Importing the person icon

const Navbar = () => {
  return (
    <header>
      <nav className="navbar">
        <div className="navbar-left">
          {/* Logo linking to the homepage */}
          <Link to="/" className="logo">
            <img src="logo.png" alt="Logo" className="logo-img" /> {/* Add your logo image */}
          </Link>
        </div>
        <div className="navbar-center">
          {/* Search Bar */}
          <input type="text" placeholder="Search..." className="search-bar" />
        </div>
        <div className="navbar-right">
          {/* Person Icon for login page */}
          <Link to="/login" className="login-icon">
            <FaUser size={30} color="#fff" />
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
