import React from "react";
import { Link } from "react-router-dom";

import './Sidebar.css';
const Sidebar = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/listing">All Listings</Link></li>
        <li><Link to="/map">Map View</Link></li>
        <li><Link to="/ranking">Ranking</Link></li>
        <li><Link to="/about">About</Link></li>
        {/* Add more links as necessary */}
      </ul>
    </div>
  );
};

export default Sidebar;
