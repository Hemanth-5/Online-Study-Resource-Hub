import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaClock,
  FaSearch,
  FaFileAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa"; // Import necessary icons
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation(); // Get current location
  const [is768, setIs768] = useState(window.innerWidth <= 768); // State for width <= 768
  const [is480, setIs480] = useState(window.innerWidth <= 480); // State for width <= 480
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false); // State to track if mobile navbar is open

  useEffect(() => {
    // Handler to update the states for responsive design
    const handleResize = () => {
      setIs768(window.innerWidth <= 768);
      setIs480(window.innerWidth <= 480);
    };

    // Set up the event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handler to toggle mobile navbar
  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <aside className="navbar">
      {/* Mobile Navbar Toggle Icon */}
      {is480 ? (
        <div className="mobile-navbar-toggle" onClick={toggleMobileNav}>
          {isMobileNavOpen ? (
            <FaTimes
              className="fa-close-icon"
              style={{ color: "white" }}
              size={30}
            />
          ) : (
            <FaBars className="fa-bars-icon" size={30} />
          )}
        </div>
      ) : (
        // Render Full Navbar for width > 480px
        <nav>
          <Link
            to="/dashboard"
            className={`nav-link ${
              location.pathname === "/dashboard" ? "active" : ""
            }`}
          >
            <FaHome className="nav-icon" />
            {!is768 && <span>Dashboard</span>}
          </Link>

          <Link
            to="/resources"
            className={`nav-link ${
              location.pathname === "/resources" ? "active" : ""
            }`}
          >
            <FaSearch className="nav-icon" />
            {!is768 && <span>Browse Resources</span>}
          </Link>

          <Link
            to="/my-uploads"
            className={`nav-link ${
              location.pathname === "/my-uploads" ? "active" : ""
            }`}
          >
            <FaBook className="nav-icon" />
            {!is768 && <span>My Uploads</span>}
          </Link>

          {/* Question Papers */}
          <Link
            to="/question-papers"
            className={`nav-link ${
              location.pathname === "/question-papers" ? "active" : ""
            }`}
          >
            <FaFileAlt className="nav-icon" />
            {!is768 && <span>Question Papers</span>}
          </Link>
        </nav>
      )}

      {/* Mobile Navbar Content (Full Sidebar) */}
      {is480 && isMobileNavOpen && (
        <div className="mobile-nav-content">
          <nav>
            <Link
              to="/dashboard"
              className={`nav-link ${
                location.pathname === "/dashboard" ? "active" : ""
              }`}
              onClick={toggleMobileNav} // Close navbar when a link is clicked
            >
              <FaHome className="nav-icon" />
            </Link>

            <Link
              to="/resources"
              className={`nav-link ${
                location.pathname === "/resources" ? "active" : ""
              }`}
              onClick={toggleMobileNav}
            >
              <FaSearch className="nav-icon" />
            </Link>

            <Link
              to="/my-uploads"
              className={`nav-link ${
                location.pathname === "/my-uploads" ? "active" : ""
              }`}
              onClick={toggleMobileNav}
            >
              <FaBook className="nav-icon" />
            </Link>

            {/* Question Papers */}
            <Link
              to="/question-papers"
              className={`nav-link ${
                location.pathname === "/question-papers" ? "active" : ""
              }`}
              onClick={toggleMobileNav}
            >
              <FaFileAlt className="nav-icon" />
            </Link>
          </nav>
        </div>
      )}
    </aside>
  );
};

export default Navbar;
