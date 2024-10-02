import React, { useEffect, useState } from "react";
import {
  fetchAllTags,
  createTag as apiCreateTag,
  deleteTag as apiDeleteTag,
} from "../../api/apiServices"; // Ensure the correct path to the service file
import "./AdminTagManagement.css";

const AdminTagManagement = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: "", type: "", parent: "" });
  const [searchTerm, setSearchTerm] = useState(""); // New state for the search term
  const [filteredTags, setFilteredTags] = useState([]); // To store filtered tags based on search input
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showCreateTagSection, setShowCreateTagSection] = useState(false); // For toggling the input section

  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchTags();
  }, []);

  // Fetch all tags from API
  const fetchTags = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to manage tags.");
      return;
    }
    try {
      const response = await fetchAllTags(token);
      setTags(response || []);
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error fetching tags");
    }
  };

  // Handle tag creation
  const handleCreateTag = async () => {
    if (!newTag.name || !newTag.type) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const createdTag = await apiCreateTag(newTag, token);
      setTags((prevTags) => [...prevTags, createdTag]); // Add the new tag to the tags list
      setMessage("Tag created successfully");
      setNewTag({ name: "", type: "", parent: "" });
    } catch (error) {
      console.error("Error creating tag:", error);
      setError("Error creating tag");
    }
  };

  // Handle tag deletion
  const handleDeleteTag = async (tagId) => {
    try {
      await apiDeleteTag(tagId, token);
      setMessage("Tag deleted successfully");
      fetchTags();
    } catch (error) {
      setError("Error deleting tag");
    }
  };

  // Handle input change for creating new tag
  const handleInputChange = (e) => {
    setNewTag({
      ...newTag,
      [e.target.name]: e.target.value,
    });
  };

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Filter tags based on search term
    setFilteredTags(
      tags.filter((tag) =>
        tag.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  // Handle tag selection from the search results
  const handleTagSelection = (tagId) => {
    setNewTag((prevTag) => ({ ...prevTag, parent: tagId }));
    setSearchTerm(""); // Clear the search term after selection
  };

  return (
    <div className="container">
      <h2>Tag Management</h2>
      {/* '+' Button to show/hide the create tag section */}
      <div className="header">
        <button
          className="toggle-button"
          onClick={() => setShowCreateTagSection(!showCreateTagSection)}
        >
          {showCreateTagSection ? "–" : "+"}
        </button>
      </div>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {/* Conditional rendering of create tag section */}
      {showCreateTagSection && (
        <div className="create-tag">
          <h3>Create a New Tag</h3>

          {/* Tag Name Input */}
          <div className="input-container">
            <label htmlFor="tagName">Tag Name</label>
            <input
              id="tagName"
              type="text"
              name="name"
              value={newTag.name}
              onChange={handleInputChange}
              placeholder="Enter tag name"
            />
          </div>

          {/* Tag Type Dropdown */}
          <div className="input-container">
            <label htmlFor="tagType">Tag Type</label>
            <select
              id="tagType"
              name="type"
              value={newTag.type}
              onChange={handleInputChange}
            >
              <option value="">Select Tag Type</option>
              <option value="department">Department</option>
              {/* <option value="course">Course</option> */}
              <option value="branch">Branch</option>
              <option value="subject">Subject</option>
              <option value="questionType">Question Type</option>
              <option value="semester">Semester</option>
              <option value="batch">Batch</option>
            </select>
          </div>

          {/* Parent Tag Search Input */}
          <div className="input-container">
            <label htmlFor="parentTag">Search Parent Tag</label>
            <input
              id="parentTag"
              type="text"
              name="parent"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search Parent Tag"
            />
          </div>

          {/* Display filtered tags based on search */}
          {searchTerm && (
            <ul className="search-results">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <li
                    key={tag._id}
                    onClick={() => handleTagSelection(tag._id)} // Handle tag selection
                    style={{ cursor: "pointer" }}
                  >
                    {tag.name} ({tag.type})
                  </li>
                ))
              ) : (
                <li>No matching tags found</li>
              )}
            </ul>
          )}

          <button className="create-tag-button" onClick={handleCreateTag}>
            Create Tag
          </button>
        </div>
      )}

      {/* Tag List */}
      <div className="tag-list">
        <h3>All Tags</h3>
        <ul>
          {tags.map((tag) => (
            <li key={tag._id}>
              {tag.name} ({tag.type})
              <button onClick={() => handleDeleteTag(tag._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminTagManagement;
