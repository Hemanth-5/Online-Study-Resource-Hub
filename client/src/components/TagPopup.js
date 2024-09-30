import "./TagPopup.css";
import { useEffect, useState } from "react";

const TagPopup = ({ tags, onTagToggle, selectedTags, style }) => {
  const [tagsWithTypes, setTagsWithTypes] = useState({});

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

  // return (
  //   <div className="tag-popup" style={style}>
  //     {tags.map((tag) => (
  //       <div
  //         key={tag._id}
  //         className={`tag ${selectedTags.includes(tag._id) ? "selected" : ""}`}
  //         onClick={() => onTagToggle(tag)}
  //       >
  //         {tag.name}
  //       </div>
  //     ))}
  //   </div>
  // );

  useEffect(() => {
    groupTags();
  }, [tags]);

  return (
    <div className="tag-popup" style={style}>
      {Object.keys(tagsWithTypes).map((type) => (
        <div key={type}>
          <h4>{type}</h4>
          <div className="tag-group">
            {tagsWithTypes[type].map((tag) => (
              <div
                key={tag._id}
                className={`tag ${
                  selectedTags.includes(tag._id) ? "selected" : ""
                }`}
                onClick={() => onTagToggle(tag)}
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

export default TagPopup;
