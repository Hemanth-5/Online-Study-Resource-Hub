import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaClock, FaSearch } from "react-icons/fa"; // Icons
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation(); // Get current location

  return (
    <aside className="navbar">
      <nav>
        <Link
          to="/dashboard"
          className={`nav-link ${
            location.pathname === "/dashboard" ? "active" : ""
          }`}
        >
          <FaHome className="nav-icon" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/resources"
          className={`nav-link ${
            location.pathname === "/resources" ? "active" : ""
          }`}
        >
          <FaSearch className="nav-icon" />
          <span>Browse Resources</span>
        </Link>

        <Link
          to="/my-uploads"
          className={`nav-link ${
            location.pathname === "/my-uploads" ? "active" : ""
          }`}
        >
          <FaBook className="nav-icon" />
          <span>My Uploads</span>
        </Link>

        {/* <Link
          to="/recent-activities"
          className={`nav-link ${
            location.pathname === "/recent-activities" ? "active" : ""
          }`}
        >
          <FaClock className="nav-icon" />
          <span>Recent Activities</span>
        </Link> */}
      </nav>
    </aside>
  );
};

export default Navbar;
