import React, {useState} from 'react';
import { FaHome, FaSearch, FaUser } from 'react-icons/fa'; // Importing icons from react-icons
import { Link } from 'react-router-dom';  // Using Link for navigation
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');  // Manage search query state

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);  // Update search query
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search Query:', searchQuery);  // You can implement search logic here
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Home Icon linking to home page */}
        <Link to="/" className="navbar-icon">
          <img src="../public/house.svg" alt="logo" />
          <span className="logo-name">davis housing</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <button type="submit">
            <img src="../public/search.svg" alt="logo" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />

        </form>

        {/* Login Icon linking to login page */}
        <Link to="/login" className="navbar-icon">
        <div className="login-icon">
          <img src="../public/user.svg" alt="logo" />
          <div>Account</div>
        </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;