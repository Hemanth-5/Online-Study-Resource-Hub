import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadResource } from "../api/apiServices"; // Import the API service
import * as pdfjsLib from "pdfjs-dist/webpack"; // Import pdfjs-dist for PDF rendering
import TagsDropdown from "../components/TagsDropdown"; // Import the TagsDropdown component
import { setPopup } from "../features/popupsSlice"; // Import popup action
import { useNavigate } from "react-router-dom";
import Header from "../components/Header"; // Import Header component
import Navbar from "../components/Navbar"; // Import Navbar component
import Popup from "../components/Popup";
import "./UploadResource.css";

const UploadResource = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");
  const [previewSrc, setPreviewSrc] = useState(""); // For image and PDF previews
  const [selectedTags, setSelectedTags] = useState([]); // Array to store selected tag IDs
  const [loading, setLoading] = useState(false); // Loading state
  const [isDragOver, setIsDragOver] = useState(false); // Dragging state
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 3000);
  };

  const closePopup = () => setPopup({ visible: false, message: "", type: "" });

  const errorRef = useRef(null); // Create a reference for the error message element

  useEffect(() => {
    if (error && errorRef.current) {
      // Focus on the error message element when error changes
      errorRef.current.focus();
    }
  }, [error]); // Run this effect whenever the `error` state changes

  const handleFileChange = (e) => {
    let selectedFile;

    // Handle drag-and-drop file event
    if (e.type === "drop") {
      e.preventDefault();
      selectedFile = e.dataTransfer?.files[0];
    } else {
      // Handle regular file selection through input
      selectedFile = e.target.files[0];
    }

    // Check if a valid file is selected before proceeding
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      previewFile(selectedFile); // Generate preview
    } else {
      setError("No file selected. Please try again.");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true); // Set drag-over state to true when file is dragged over the area
  };

  const handleDragLeave = () => {
    setIsDragOver(false); // Reset drag-over state when file is dragged out of the area
  };

  const previewFile = (file) => {
    const fileType = file.type;

    // Preview images
    if (fileType.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result); // Set image source to display
      };
      reader.readAsDataURL(file);
    }

    // Preview PDFs (First page)
    else if (fileType === "application/pdf") {
      const reader = new FileReader();
      reader.onloadend = () => {
        const typedArray = new Uint8Array(reader.result);
        pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
          pdf.getPage(1).then((page) => {
            const scale = 1.5;
            const viewport = page.getViewport({ scale });
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
              canvasContext: context,
              viewport: viewport,
            };
            page.render(renderContext).promise.then(() => {
              setPreviewSrc(canvas.toDataURL()); // Set PDF first page preview
            });
          });
        });
      };
      reader.readAsArrayBuffer(file);
    } else {
      setPreviewSrc(""); // For unsupported file types, don't preview
    }
  };

  const handleTagSelection = (selectedTagIds) => {
    setSelectedTags(selectedTagIds); // Store selected tag IDs
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Set loading state to true

    // Validate required fields
    if (!file || !title || !category || selectedTags.length === 0) {
      setError("Please fill in all required fields and select tags.");
      setLoading(false); // Set loading state to false
      return;
    }

    // Create FormData for the file upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("visibility", visibility);

    formData.append("tags[]", selectedTags);

    // Check whether file name already exists in the database
    try {
      const response = await uploadResource(token, formData); // Pass token and formData to API function

      if (response.message === "File already exists") {
        setError("Resource already exists. Please upload a different file.");
        setLoading(false); // Set loading state to false
        return;
      } else if (response.ok) {
        showPopup("Resource uploaded successfully!", "success");
        setTimeout(() => navigate("/my-uploads", { replace: true }), 3000);
      }
    } catch (err) {
      setError("Error uploading resource. Please try again.");
      setLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="upload-page-container">
      {/* Header and Navbar */}
      <Header />

      {popup.visible && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
      )}

      <div className="upload-page-main">
        <Navbar />

        {/* Upload Form Content */}
        <div className="upload-content-wrapper">
          {loading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
            </div>
          )}
          <h2>Upload New Resource</h2>

          {/* Error message with reference for focus */}
          {error && (
            <p
              className="error-message"
              ref={errorRef} // Attach the ref to the error message element
              tabIndex={-1} // Set tabIndex to make it focusable
            >
              {error}
            </p>
          )}

          <form onSubmit={handleUpload}>
            {/* Drag and Drop or File Upload */}
            <div className="form-group form-drag-drop-preview">
              {previewSrc && (
                <div className="file-preview">
                  <h4>File Preview</h4>
                  {file?.type.startsWith("image/") ||
                  file?.type === "application/pdf" ? (
                    <img src={previewSrc} alt="File Preview" />
                  ) : (
                    <p>Preview not available for this file type.</p>
                  )}
                </div>
              )}
              <div className="drag-drop-preview-group">
                <input
                  type="file"
                  id="file-input"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div
                  className={`drag-drop-area ${isDragOver ? "drag-over" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleFileChange}
                  onClick={() => document.getElementById("file-input").click()}
                >
                  {file == null ? (
                    <p>
                      Drag and drop your file here, or click to select a file.
                    </p>
                  ) : (
                    <p>
                      {file.name} <br></br>
                      (Click to replace file)
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Other form inputs */}
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="tags">Tags</label>
              <TagsDropdown onTagSelect={handleTagSelection} />
            </div>

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
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="visibility">Visibility</label>
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <button type="submit" className="upload-button" disabled={loading}>
              Upload Resource
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadResource;
