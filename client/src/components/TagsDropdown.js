import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTags, setLoading, setError } from "../features/tagSlice";
import { fetchAllTags } from "../api/apiServices"; // API service for initial fetch
import "./TagsDropdown.css"; // Import CSS for pill styling

const TagDropdown = ({ onTagSelect }) => {
  const dispatch = useDispatch();
  const tags = useSelector((state) => state.tag.tags); // Get tags from Redux state
  const status = useSelector((state) => state.tag.status); // Get tags from Redux state
  const error = useSelector((state) => state.tag.error); // Get tags from Redux state
  const [selectedTagIds, setSelectedTagIds] = useState([]);

  console.log(tags);
  useEffect(() => {
    // If tags are not already loaded, fetch them
    if (status === "idle") {
      const fetchTags = async () => {
        dispatch(setLoading("loading"));
        try {
          const token = localStorage.getItem("accessToken").toString(); // Retrieve token from localStorage
          const response = await fetchAllTags(token); // Fetch tags from API
          dispatch(setTags(response)); // Store tags in Redux state
          dispatch(setLoading("succeeded"));
        } catch (err) {
          dispatch(setError(err.message)); // Handle error
          dispatch(setLoading("failed"));
        }
      };
      fetchTags();
    }
  }, [dispatch, status]);

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

  // Conditional rendering based on the state
  if (status === "loading") {
    return <p>Loading tags...</p>;
  }

  if (error) {
    return <p>Error fetching tags: {error}</p>;
  }

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
