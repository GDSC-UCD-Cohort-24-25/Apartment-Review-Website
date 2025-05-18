import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';  // Using Link for navigation
import { useAuth } from "../Auth";

import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');  
  const { user, loading } = useAuth();
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); 
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search Query:', searchQuery);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-icon">
          <img src="/house.svg" alt="logo" />
          <span className="logo-name">aggie housing</span>
        </Link>

        <form onSubmit={handleSearchSubmit} className="search-bar">
          <div className = "contentsFrame">
            <button type="submit">
            <img src="/search.svg" alt="logo" />
            </button>
            <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search"
            />
          </div> 
        </form>
        <div className='user-info'>
          <Link to={user ? `/profile` : "/login"} className="login-icon">
            <img src="/user.svg" alt="logo" />
            <div className = "accountText">{user ? 'Profile' : 'Login'}</div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;