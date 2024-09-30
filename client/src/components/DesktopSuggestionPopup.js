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
          The website is currently under development and may not be fully
          optimized for mobile devices.For the best experience, please view this
          site on a desktop. If you're on a mobile device, enable Desktop View
          in your browser. Thank you! 😊
        </p>
        <button className="desktop-popup-button" onClick={onClose}>
          Okay, Got it!
        </button>
      </div>
    </div>
  );
};

export default DesktopSuggestionPopup;
