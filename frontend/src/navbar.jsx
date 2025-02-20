import React from "react";
import { Link } from "react-router-dom";


function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
      <li>
          <Link to="/">
            <button className="nav-button">Home</button>
          </Link>
        </li>
        <li>
          <Link to="/about">
            <button className="nav-button">About</button>
          </Link>
        </li>
        <li>
          <Link to="/contact">
            <button className="nav-button">Contact</button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
 