import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';  // Using Link for navigation
import supabase from './supabase-client';
import './Navbar.css';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');  // Manage search query state
  const [userId, setUserId] = useState(null);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);  // Update search query
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search Query:', searchQuery);  // You can implement search logic here
  };
  
  const handleLogout = async () => {
      const { error } = await supabase.auth.signOut()
      console.log("Button clicked!");
  };


  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    fetchSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => { authListener.subscription.unsubscribe(); }; // Cleanup listener when component unmounts
  }, []);
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Home Icon linking to home page */}
        <Link to="/" className="navbar-icon">
          <img src="/house.svg" alt="logo" />
          <span className="logo-name">davis housing</span>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="search-bar">
          <button type="submit">
            <img src="/search.svg" alt="logo" />
          </button>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
          />

        </form>
        <div className='user-info'>
          {userId && (
            <button onClick={handleLogout} className="signout-button">
              Logout
            </button>
          )}
          {/* Login Icon linking to login page */}
          <Link to={userId ? `/profile/${userId}` : "/login"} className="navbar-icon">
          <div className="login-icon">
            <img src="/user.svg" alt="logo" />
            <div>{userId ? 'Account' : 'Login'}</div>
          </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;