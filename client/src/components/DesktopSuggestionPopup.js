// src/components/DesktopSuggestionPopup.js

import React from "react";
import "./DesktopSuggestionPopup.css";

const DesktopSuggestionPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="desktop-popup-overlay">
      <div className="desktop-popup-container">
        <h2>Switch to Desktop View</h2>
        <p>
          {/* For a better experience, we recommend using the desktop version of the
          website. */}
          The website is still under development. Please use the desktop version
          for a better experience. Thank you! 😊
        </p>
        <div className="desktop-popup-actions">
          <button className="desktop-popup-button" onClick={onClose}>
            Okay, Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default DesktopSuggestionPopup;
