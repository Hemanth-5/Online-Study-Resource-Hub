import React, { useState, useEffect } from "react";
import TagsDropdown from "../components/TagsDropdown";
import "./EditResourceModal.css";
import Popup from "./Popup";

const EditResourceModal = ({ resource, onSave, onClose }) => {
  const [tags, setTags] = useState(resource.tags || []); // Use resource tags as initial state
  console.log({ initialTags: tags });
  const [category, setCategory] = useState(resource.category || "");
  const [fileName, setFileName] = useState(resource.fileName || "");
  const [description, setDescription] = useState(resource.description || "");
  const [accessLevel, setAccessLevel] = useState(
    resource.accessLevel || "public"
  );
  const [file, setFile] = useState(null);
  // const [filePreview, setFilePreview] = useState(resource.file || null); // Preview existing file if available
  const [errorMessage, setErrorMessage] = useState("");
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  // Handle file selection and preview
  // const handleFileChange = (e) => {
  //   const selectedFile = e.target.files[0];
  //   setFile(selectedFile);

  //   // Generate a preview URL if the selected file is an image or PDF
  //   if (
  //     selectedFile &&
  //     (selectedFile.type.includes("image") || selectedFile.type.includes("pdf"))
  //   ) {
  //     const fileURL = URL.createObjectURL(selectedFile);
  //     setFilePreview(fileURL);
  //   } else {
  //     setFilePreview(null);
  //   }
  // };
  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 4000); // Auto-close after 4 seconds
  };

  const closePopup = () => setPopup({ visible: false, message: "", type: "" });
  // Handle tag selection from TagsDropdown
  const handleTagSelection = (selectedTagIds) => {
    // console.log({ selectedTagIds });
    setTags(selectedTagIds);
  };

  // Handle form submission
  const handleSubmit = () => {
    // if (!category || !description || tags.length === 0) {
    //   setErrorMessage("Please fill in all fields.");
    //   return;
    // }

    const formData = new FormData();
    // tags.forEach((tagId) => {
    //   formData.append("tags[]", tagId);
    // });
    formData.append("tags[]", tags);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("accessLevel", accessLevel);
    formData.append("fileName", fileName);
    formData.append("isQuestionPaper", category === "questionPapers");
    // if (file) {
    //   formData.append("file", file);
    // }

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
        <div className="popup-content">
          {/* Title */}
          <div className="form-group">
            <label htmlFor="fileName">Title</label>
            <input type="text" id="fileName" value={fileName} />
          </div>
          {/* Description Field */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter resource description"
              rows="4"
            />
          </div>

          {/* Tags Dropdown */}
          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <TagsDropdown
              onTagSelect={handleTagSelection}
              selectedTags={tags}
            />
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="book">Book</option>
              <option value="notes">Notes</option>
              <option value="questionPapers">Question Paper</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Access Level Dropdown */}
          <div className="form-group">
            <label htmlFor="accessLevel">Access Level</label>
            <select
              id="accessLevel"
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* File Input Area with Drag-and-Drop Zone and Preview */}
          {/* <div className="form-group">
            <label htmlFor="file">Replace File</label>
            <div className="file-input-container">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="file-input"
              />
              <div className="file-preview">
                {filePreview ? (
                  // If file is an image or PDF, show preview
                  <div className="file-preview-content">
                    {filePreview.includes("pdf") ? (
                      <iframe
                        src={filePreview}
                        title="PDF Preview"
                        className="file-preview-frame"
                      ></iframe>
                    ) : (
                      <img
                        src={filePreview}
                        alt="File Preview"
                        className="file-preview-image"
                      />
                    )}
                  </div>
                ) : (
                  <span>No file selected</span>
                )}
              </div>
            </div>
          </div> */}
        </div>

        {popup.visible && (
          <Popup
            message={popup.message}
            type={popup.type}
            onClose={closePopup}
          />
        )}

        {/* Save and Cancel Buttons */}
        <div className="form-buttons">
          <button className="save-button" onClick={handleSubmit}>
            Save Changes
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditResourceModal;
