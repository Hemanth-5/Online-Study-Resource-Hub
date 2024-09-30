// src/components/DesktopSuggestionPopup.js

import React from "react";
import "./DesktopSuggestionPopup.css"; // Create CSS file for styling the popup

const DesktopSuggestionPopup = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="desktop-popup-overlay">
      <div className="desktop-popup-container">
        <h2>Switch to Desktop View</h2>
        <p>
          For a better experience, we recommend using the desktop version of the
          website.
        </p>
        <button className="desktop-popup-button" onClick={onClose}>
          Okay, Got it!
        </button>
      </div>
    </div>
  );
};

export default DesktopSuggestionPopup;
