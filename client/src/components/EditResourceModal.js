import React, { useState } from "react";
import "./EditResourceModal.css"; // Adjust the path as needed

const EditResourceModal = ({ resource, onSave, onClose }) => {
  const [tags, setTags] = useState(resource.tags || []);
  const [category, setCategory] = useState(resource.category || "");
  const [description, setDescription] = useState(resource.description || "");
  const [accessLevel, setAccessLevel] = useState(
    resource.accessLevel || "public"
  ); // Default accessLevel
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTagChange = (e) => {
    const newTags = e.target.value.split(",").map((tag) => tag.trim());
    setTags([...new Set(newTags)]); // Remove duplicates
  };

  const handleSubmit = () => {
    // Validate that category, description, and at least one tag are present
    if (!category || !description || tags.length === 0) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("tags", JSON.stringify(tags));
    formData.append("category", category);
    formData.append("description", description);
    formData.append("accessLevel", accessLevel);

    if (file) {
      formData.append("file", file);
    }

    // Trigger the save function to handle the API call
    onSave(resource._id, formData)
      .then(() => onClose()) // Close modal if save is successful
      .catch((error) =>
        setErrorMessage("Error saving resource: " + error.message)
      );
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Edit Resource</h2>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter resource description"
            rows="4"
          />
        </div>

        <div>
          <label>Tags:</label>
          <input
            type="text"
            value={tags.join(", ")}
            onChange={handleTagChange}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
          />
        </div>

        <div>
          <label>Access Level:</label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <label>Replace File:</label>
          <input type="file" onChange={handleFileChange} />
        </div>

        <button className="save-button" onClick={handleSubmit}>
          Save Changes
        </button>
        {/* Add hover for cancel */}
        <button className="cancel-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditResourceModal;
