import React from "react";
import { Link } from "react-router-dom";
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">
          <div class = "test">
            <img src="/home-icon.svg" alt="Home Page" className="icon" />
            <span>Home</span>
          </div>
          </Link>
        </li>
        <li>
          <Link to="/listing">
          <div>
            <img src="/all-icon.svg" alt="All Listings" className="icon" />
            <span>All Listings</span>
          </div>
          </Link>
        </li>
        <li>
          <Link to="/map">
          <div>
            <img src="/map.svg" alt="Map View" className="icon" />
            <span>Map View</span>
          </div>
          </Link>
        </li>
        <li>
          <Link to="/ranking">
          <div>
            <img src="/ranking.svg" alt="Ranking" className="icon" />
            <span>Ranking</span>
          </div>
          </Link>
        </li>
        <li>
          <Link to="/about">
          <div>
            <img src="/information.svg" alt="About" className="icon" />
            <span>About</span>
          </div>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
