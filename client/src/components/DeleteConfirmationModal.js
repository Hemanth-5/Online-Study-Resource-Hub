import React from "react";
import "./DeleteConfirmationModal.css"; // Custom styles for the modal
import { FaExclamationTriangle } from "react-icons/fa"; // Optional warning icon

const DeleteConfirmationModal = ({ onConfirm, onCancel, resourceName }) => {
  return (
    <div className="delete-confirmation-overlay">
      <div className="delete-confirmation-modal">
        <FaExclamationTriangle className="warning-icon" />
        <h2>Are you sure?</h2>
        <p>
          Do you really want to delete the resource{" "}
          <strong>{resourceName}</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions">
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
