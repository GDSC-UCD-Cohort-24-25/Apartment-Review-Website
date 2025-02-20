import React from "react";
import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
      <li>
          <Link to="/home">
            <button className="nav-button">Home Page</button>
          </Link>
        </li>
      <li>
          <Link to="/listing">
            <button className="nav-button">All Listing</button>
          </Link>
        </li>
      <li>
          <Link to="/map">
            <button className="nav-button">Map View</button>
          </Link>
        </li>
        <li>
          <Link to="/ranking">
            <button className="nav-button">Ranking</button>
          </Link>
        </li>
        <li>
          <Link to="/about">
            <button className="nav-button">About</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
 