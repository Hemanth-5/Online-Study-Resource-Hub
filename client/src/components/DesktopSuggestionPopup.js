// src/components/DesktopSuggestionPopup.js
import React from "react";
import "./DesktopSuggestionPopup.css"; // Add appropriate styles

const DesktopSuggestionPopup = ({ onClose }) => {
  return (
    <div className="desktop-suggestion-popup">
      <div className="popup-content">
        <h2>Switch to Desktop View</h2>
        <p>
          The website is currently under development and may not be fully
          optimized for mobile devices.For the best experience, please view this
          site on a desktop. If you're on a mobile device, enable Desktop View
          in your browser. Thank you! 😊
        </p>
        <button onClick={onClose} className="close-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default DesktopSuggestionPopup;
