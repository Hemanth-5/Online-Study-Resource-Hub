import "./QuestionPaperFilterPopup.css";
import { useEffect, useState } from "react";

const QuestionPaperFilterPopup = ({
  tags,
  onTagToggle,
  selectedTags,
  style,
}) => {
  const [qpTagsWithTypes, setQPTagsWithTypes] = useState({});

  const groupTags = () => {
    const tagsByType = {};
    tags.forEach((tag) => {
      if (!tagsByType[tag.type]) {
        tagsByType[tag.type] = [];
      }
      tagsByType[tag.type].push(tag);
    });

    // Only allow types specific to question papers
    setQPTagsWithTypes(tagsByType);
  };

  useEffect(() => {
    groupTags();
  }, [tags]);

  return (
    <div className="question-tag-popup" style={style}>
      {Object.keys(qpTagsWithTypes).map((type) => (
        <div key={type}>
          <h4>{type}</h4>
          <div className="question-tag-group">
            {qpTagsWithTypes[type].map((tag) => (
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

export default QuestionPaperFilterPopup;
