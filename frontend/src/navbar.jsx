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
          <FaHome size={24} />
          <span>Davis Housing</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />
          <button type="submit">
            <FaSearch size={20} />
          </button>
        </form>

        {/* Login Icon linking to login page */}
        <Link to="/login" className="navbar-icon">
          <FaUser size={24} />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;