import React, { useEffect, useState } from "react";
import {
  fetchAllTags,
  createTag as apiCreateTag,
  deleteTag as apiDeleteTag,
} from "../../api/apiServices"; // Ensure the correct path to the service file

const AdminTagManagement = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: "", type: "", parent: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("accessToken");
  console.log("Token in AdminTagManagement:", token); // Log the token

  useEffect(() => {
    // Fetch all tags when the component loads
    fetchTags();
  }, []);

  const fetchTags = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("You must be logged in to manage tags.");
      return;
    }
    try {
      const response = await fetchAllTags(token);
      console.log("Fetched Tags:", response); // Check the structure of the response
      setTags(response || []); // Ensure tags is always an array
    } catch (error) {
      console.error("Fetch error:", error);
      setError("Error fetching tags");
    }
  };

  const handleCreateTag = async () => {
    // Renamed function
    try {
      await apiCreateTag(newTag, token); // Use imported apiCreateTag
      setMessage("Tag created successfully");
      setNewTag({ name: "", type: "", parent: "" });
      fetchTags();
    } catch (error) {
      setError("Error creating tag");
    }
  };

  const handleDeleteTag = async (tagId) => {
    // Renamed function
    try {
      await apiDeleteTag(tagId, token); // Use imported apiDeleteTag
      setMessage("Tag deleted successfully");
      fetchTags();
    } catch (error) {
      setError("Error deleting tag");
    }
  };

  const handleInputChange = (e) => {
    setNewTag({
      ...newTag,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <h2>Tag Management</h2>

      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="create-tag">
        <h3>Create a New Tag</h3>
        <input
          type="text"
          name="name"
          value={newTag.name}
          onChange={handleInputChange}
          placeholder="Tag Name"
        />
        <select name="type" value={newTag.type} onChange={handleInputChange}>
          <option value="">Select Tag Type</option>
          <option value="department">Department</option>
          <option value="course">Course</option>
          <option value="branch">Branch</option>
          <option value="subject">Subject</option>
        </select>
        <select
          name="parent"
          value={newTag.parent}
          onChange={handleInputChange}
        >
          <option value="">Select Parent Tag</option>
          {tags.map((tag) => (
            <option key={tag._id} value={tag._id}>
              {tag.name}
            </option>
          ))}
        </select>
        <button onClick={handleCreateTag}>Create Tag</button>
      </div>

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
