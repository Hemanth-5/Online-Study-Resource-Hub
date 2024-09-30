import React, { useEffect, useState } from "react";
import axios from "axios";

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: "", type: "", parent: "" });
  const [selectedTag, setSelectedTag] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch all tags when the component loads
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await axios.get("/api/tags");
      setTags(response.data);
    } catch (error) {
      setError("Error fetching tags");
    }
  };

  const createTag = async () => {
    try {
      await axios.post("/api/tags", newTag);
      setMessage("Tag created successfully");
      setNewTag({ name: "", type: "", parent: "" });
      fetchTags();
    } catch (error) {
      setError("Error creating tag");
    }
  };

  const deleteTag = async (tagId) => {
    try {
      await axios.delete(`/api/tags/${tagId}`);
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
        <button onClick={createTag}>Create Tag</button>
      </div>

      <div className="tag-list">
        <h3>All Tags</h3>
        <ul>
          {tags.map((tag) => (
            <li key={tag._id}>
              {tag.name} ({tag.type})
              <button onClick={() => deleteTag(tag._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
//exported
export default TagManagement;
