// Sidebar.jsx
import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/",        icon: "/home-icon.svg",   label: "Home" },
  { to: "/listing", icon: "/all.svg",    label: "All Listings" },
  { to: "/map",     icon: "/map.svg",         label: "Map View" },
  { to: "/ranking", icon: "/ranking.svg",     label: "Ranking" },
  { to: "/about",   icon: "/about.svg", label: "About" },
  { to: "/quiz", icon: "/about.svg",label: "Quiz"}
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const onResize = () => setCollapsed(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--side-bar-width",
      collapsed ? "64px" : "238px"
    );
  }, [collapsed]);

  return (
    <div className="sidebar">
      <ul>
        {navItems.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          const iconSrc = isActive
            ? icon.replace(/\.svg$/, "-on.svg")
            : icon;

          return (   
            <li key={to}>
              <Link to={to}>
              <div className={`menu-item${isActive ? " active" : ""}`}>
              <img src={iconSrc} alt={label} className="icon" />
                  {!collapsed && <span>{label}</span>}
                </div>
              </Link>
            </li>
          )
      })}
      </ul>
    </div>
  );
}
