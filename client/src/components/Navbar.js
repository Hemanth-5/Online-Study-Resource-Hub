import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBook, FaClock, FaSearch, FaFileAlt } from "react-icons/fa"; // Icons
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation(); // Get current location
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // State for mobile view

  useEffect(() => {
    // Handler to update the isMobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set up the event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array to run this effect only on mount/unmount

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
          {!isMobile && <span>Dashboard</span>}
        </Link>

        <Link
          to="/resources"
          className={`nav-link ${
            location.pathname === "/resources" ? "active" : ""
          }`}
        >
          <FaSearch className="nav-icon" />
          {!isMobile && <span>Browse Resources</span>}
        </Link>

        <Link
          to="/my-uploads"
          className={`nav-link ${
            location.pathname === "/my-uploads" ? "active" : ""
          }`}
        >
          <FaBook className="nav-icon" />
          {!isMobile && <span>My Uploads</span>}
        </Link>

        {/* <Link
          to="/recent-activities"
          className={`nav-link ${
            location.pathname === "/recent-activities" ? "active" : ""
          }`}
        >
          <FaClock className="nav-icon" />
          {!isMobile && <span>Recent Activities</span>}
        </Link> */}

        {/* Question paper */}
        <Link
          to="/question-papers"
          className={`nav-link ${
            location.pathname === "/question-papers" ? "active" : ""
          }`}
        >
          <FaFileAlt className="nav-icon" />
          {!isMobile && <span>Question Papers</span>}
        </Link>
      </nav>
    </aside>
  );
};

export default Navbar;
