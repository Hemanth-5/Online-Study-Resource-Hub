import React, { useState } from "react";
import { FaStar } from "react-icons/fa"; // Ensure you have react-icons installed

const StarRating = ({ count = 5, rating, setRating }) => {
  // Array to render stars up to the given count
  return (
    <div className="star-container">
      {[...Array(count)].map((_, index) => (
        <FaStar
          className="star"
          key={index}
          size={30}
          onClick={() => setRating(index + 1)} // Set rating when star is clicked
          onMouseOver={() => setRating(index + 1)} // Show preview on hover
          style={{
            marginRight: 10,
            cursor: "pointer",
            alignSelf: "center",
            color: index < rating ? "#ffc107" : "#e4e5e9", // Highlight stars up to the rating
          }}
        />
      ))}
    </div>
  );
};

export default StarRating;
