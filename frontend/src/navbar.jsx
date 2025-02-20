import React from "react";
import { Link } from "react-router-dom";
import './App.css';


function Navbar() {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
      <li><a href="/about.jsx">Home</a></li>
      <li><a href="/officer">About</a></li>
      <li><a href="/officer">Contact</a></li>
      <li><a href="/officer">Apartments</a></li>
      </ul>
    </nav>
  );
}

export default Navbar;
 