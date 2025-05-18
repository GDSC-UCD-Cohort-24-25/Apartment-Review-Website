import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';  // Using Link for navigation
import { useAuth } from "../Auth";
import { useApartments } from "../ApartmentProvider";

import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');  
  const [searchResults, setSearchResults] = useState([]);

  const { user, loading } = useAuth();
  const { apartments, loading: apartmentsLoading } = useApartments();

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); 
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (loading) return;

    // filter by apartment.apartment.name (case-insensitive)
    const results = apartments.filter(item =>
      item.apartment.name
        .toLowerCase()
        .includes(searchQuery.trim().toLowerCase())
    );

    console.log('Search Query:', searchQuery, 'Results:', results);
    setSearchResults(results);
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
        {/* simple dropdown of results; you can style this later */}
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map(item => (
              <li key={item.apartment.id}>
                <Link to={`/apartment/${item.apartment.id}`}>
                  {item.apartment.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;