import "./TagPopup.css";
import { useEffect, useState } from "react";

const TagPopup = ({ tags, onTagToggle, selectedTags, style }) => {
  const [tagsWithTypes, setTagsWithTypes] = useState({});
  const [isTagTypeSelected, setIsTagTypeSelected] = useState({});

  // Group tags by their type (e.g., Branch, Course)
  const groupTags = () => {
    const tagsByType = {};
    tags.forEach((tag) => {
      if (!tagsByType[tag.type]) {
        tagsByType[tag.type] = [];
      }
      tagsByType[tag.type].push(tag);
    });
    setTagsWithTypes(tagsByType);
  };

  // Initialize visibility state for each tag group (collapsed initially)
  const initializeTagTypeSelection = () => {
    const tagTypeSelection = {};
    Object.keys(tagsWithTypes).forEach((type) => {
      tagTypeSelection[type] = false; // Set each type to collapsed initially
    });
    setIsTagTypeSelected(tagTypeSelection);
  };

  // Toggle visibility of a specific tag group
  const toggleSelection = (type) => {
    setIsTagTypeSelected((prev) => ({
      ...prev,
      [type]: !prev[type], // Toggle the visibility of the tag group
    }));
  };

  // Handle clicking a tag without affecting the tag group visibility
  const handleTagClick = (tag, event) => {
    event.stopPropagation(); // Prevent the tag click from affecting the parent header
    onTagToggle(tag); // Call the function to update the selected tags state
  };

  // Group tags whenever the `tags` prop changes
  useEffect(() => {
    groupTags();
  }, [tags]);

  // Initialize visibility state whenever grouped tags change
  useEffect(() => {
    initializeTagTypeSelection();
  }, []);

  return (
    <div className="tag-popup" style={style}>
      {Object.keys(tagsWithTypes).map((type) => (
        <div key={type} className="tag-section">
          <h4 onClick={() => toggleSelection(type)}>
            {type}
            {isTagTypeSelected[type] ? " -" : " +"}{" "}
            {/* Show collapse/expand icon */}
          </h4>
          {/* Render tags only if the group is expanded */}
          {isTagTypeSelected[type] && (
            <div className="tag-group open">
              {tagsWithTypes[type].map((tag) => (
                <div
                  key={tag._id}
                  className={`tag ${
                    selectedTags.includes(tag._id) ? "selected" : ""
                  }`}
                  onClick={(event) => handleTagClick(tag, event)}
                >
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TagPopup;
