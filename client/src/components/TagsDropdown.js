import React, { useState, useEffect } from "react";
import { fetchAllTags } from "../api/apiServices";
import "./TagsDropdown.css"; // Import CSS for pill styling

const TagDropdown = ({ onTagSelect }) => {
  const [tags, setTags] = useState([]);
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const token = localStorage.getItem("accessToken").toString(); // Retrieve token from localStorage
      const response = await fetchAllTags(token); // Fetch tags
      setTags(response); // Store tags in state
    };

    fetchTags();
  }, []);

  // Group tags by their 'type' (or any other categorization)
  const groupedTagsByType = tags.reduce((acc, tag) => {
    const { type } = tag;
    if (!acc[type]) acc[type] = [];
    acc[type].push(tag);
    return acc;
  }, {});

  // Toggle selection of a tag
  const handleTagClick = (tagId) => {
    if (selectedTagIds.includes(tagId)) {
      setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId)); // Deselect tag
    } else {
      setSelectedTagIds([...selectedTagIds, tagId]); // Select tag
    }
    onTagSelect(selectedTagIds); // Notify parent component of selection
  };

  return (
    <div className="tag-dropdown-container">
      {Object.entries(groupedTagsByType).map(([type, tags]) => (
        <div key={type}>
          {/* Capitalize type */}
          <h4>{type}</h4> {/* Type Header */}
          <div className="tag-group">
            {tags.map((tag) => (
              <div
                key={tag._id}
                className={`tag-pill ${
                  selectedTagIds.includes(tag._id) ? "selected" : ""
                }`}
                onClick={() => handleTagClick(tag._id)} // Toggle on click
              >
                {tag.name}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagDropdown;
