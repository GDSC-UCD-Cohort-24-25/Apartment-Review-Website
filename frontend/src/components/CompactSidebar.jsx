import React from "react";
import { Link } from "react-router-dom";
import './CompactSidebar.css';

const CompactSidebar = () => {
    return (
        <div class = "collasped"> 
            <ul>
                <li>
                    <Link to="/allListing">
                    <img src="/all-icon.svg" alt="All Listings" className="icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/map">
                    <img src="/map.svg" alt="Map View" className="icon" />
                    </Link>
                </li>
                <li>
                    <Link to="/ranking">
                    <img src="/ranking.svg" alt="Ranking" className="icon" /> 
                    </Link>
                </li>
                <li>
                    <Link to="/about">
                    <img src="/information.svg" alt="About" className="icon" />
                    </Link>
                </li>
            </ul>
        </div>
    ); 
}; 

export default CompactSidebar;
