import React from "react";
import "./Popup.css";

const Popup = ({ message, type, onClose }) => {
  // Determine the background color and loading bar color based on the type
  const loadingBarColor =
    type === "success" ? "green" : type === "failure" ? "red" : "yellow";

  return (
    <div className="popup">
      <button
        className="popup-close-button"
        onClick={onClose}
        style={{ color: "black" }}
      >
        &times;
      </button>
      <div className="popup-message">{message}</div>
      <div className="loading-bar-container">
        <div
          className="loading-bar"
          style={{ backgroundColor: loadingBarColor }}
        />
      </div>
    </div>
  );
};

export default Popup;
