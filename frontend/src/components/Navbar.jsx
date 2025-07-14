import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../Auth";
import { useApartments } from "../ApartmentProvider";
import './Navbar.css';

const Navbar = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  
  const searchRef = useRef(null);
  const navigate = useNavigate();
  
  const { user, loading: userLoading } = useAuth();
  const { apartments, loading: apartmentsLoading } = useApartments();

  // Handle clicks outside search to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearchActive(false);
      // Reset search results when query is empty
      if (onSearchResults) {
        onSearchResults([]);
      }
    } else if (!apartmentsLoading) {
      const results = apartments.filter(item =>
        item.apartment.name.toLowerCase().includes(value.trim().toLowerCase())
      );
      
      // Show only first 3 suggestions
      setSuggestions(results.slice(0, 3));
      setShowSuggestions(true);
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    performSearch();
  };

  const performSearch = () => {
    if (userLoading || apartmentsLoading) return;

    const trimmedQuery = searchQuery.trim().toLowerCase();
    setShowSuggestions(false);
    
    if (trimmedQuery === '') {
      // Reset to show all apartments
      setIsSearchActive(false);
      if (onSearchResults) {
        onSearchResults([]);
      }
      return;
    }

    const results = apartments.filter(item =>
      item.apartment.name.toLowerCase().includes(trimmedQuery)
    );

    console.log('Search Query:', searchQuery, 'Results:', results);
    
    // Pass results to parent component to filter displayed apartments
    if (onSearchResults) {
      onSearchResults(results);
    }
    
    setIsSearchActive(true);
  };

  const handleSuggestionClick = (apartmentName) => {
    setSearchQuery(apartmentName);
    setShowSuggestions(false);
    
    // Perform search with the selected suggestion
    const results = apartments.filter(item =>
      item.apartment.name.toLowerCase().includes(apartmentName.toLowerCase())
    );
    
    if (onSearchResults) {
      onSearchResults(results);
    }
    
    setIsSearchActive(true);
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim() !== '' && suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setIsSearchActive(false);
    if (onSearchResults) {
      onSearchResults([]);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-icon">
          <img src="/house.svg" alt="logo" />
          <span className="logo-name">aggie housing</span>
        </Link>

        <div className="search-container" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="search-bar">
            <div className="contentsFrame">
              <button type="submit">
                <img src="/search.svg" alt="search" />
              </button>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                placeholder="Search"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  className="clear-search"
                >
                </button>
              )}
            </div>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-dropdown">
              <ul className="search-suggestions">
                {suggestions.map(item => (
                  <li 
                    key={item.apartment.id}
                    onClick={() => handleSuggestionClick(item.apartment.name)}
                    className="suggestion-item"
                  >
                    <img src="/search.svg" alt="search" className="suggestion-icon" />
                    <span>{item.apartment.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className='user-info'>
          <Link to={user ? `/profile` : "/login"} className="login-icon">
            <img src="/user.svg" alt="user" />
            <div className="accountText">{user ? 'Profile' : 'Login'}</div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;