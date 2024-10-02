import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../components/StarRating"; // Ensure to import the StarRating component
import "./FeedbackForm.css"; // Optional: You can use this for custom styling
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import { setUserProfile } from "../features/userSlice";
import { postFeedback, updateFeedback } from "../api/apiServices";
import Popup from "../components/Popup";

const FeedbackForm = () => {
  const userProfile = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const token = localStorage.getItem("accessToken");
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const navigate = useNavigate();
  // Check for previous feedback
  useEffect(() => {
    if (userProfile.providedFeedback) {
      // Set ratings if feedback is already provided
      setRatings(userProfile.feedbackInfo);
    }
  }, [userProfile]);

  console.log(userProfile);

  // State to track ratings for each question
  const [ratings, setRatings] = useState({
    question1: 0,
    question2: 0,
    question3: 0,
    question4: 0,
    question5: 0,
  });

  // Handler to update state when a rating is set
  const handleRatingChange = (question, value) => {
    setRatings({ ...ratings, [question]: value });
  };

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 4000); // Auto-close after 4 seconds
  };

  const closePopup = () => setPopup({ visible: false, message: "", type: "" });

  // Submit handler to process feedback (this can be integrated with Google Sheets or an API)
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("Submitted Ratings: ", ratings);
    // Add your integration or processing logic here
    // If already provdied feedback, update feedback
    if (userProfile.providedFeedback) {
      updateFeedback(token, ratings)
        .then((response) => {
          console.log(response);
          if (response.message === "Feedback updated") {
            dispatch(setUserProfile({ ...userProfile, feedbackInfo: ratings }));
            showPopup("Feedback updated successfully", "success");
            setTimeout(() => navigate("/dashboard"), 3000);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Post feedback if not provided
      postFeedback(token, ratings)
        .then((response) => {
          console.log(response);
          if (response.message === "Feedback submitted") {
            dispatch(
              setUserProfile({
                ...userProfile,
                feedbackInfo: ratings,
                providedFeedback: true,
              })
            );
            showPopup("Feedback submitted successfully", "success");
            setTimeout(() => navigate("/dashboard"), 3000);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <div className="feedback-form-container">
      <Header />
      <div className="feedback-form-main">
        <Navbar />
        <div className="feedback-form-content">
          <h2>Feedback Form</h2>
          {popup.visible && (
            <Popup
              message={popup.message}
              type={popup.type}
              onClose={closePopup}
            />
          )}
          <form onSubmit={handleSubmit}>
            {/* Question 1 */}
            <div className="question-container">
              <label>
                1. How would you rate the ease of navigation within the resource
                hub?
              </label>
              <StarRating
                rating={ratings.question1}
                setRating={(value) => handleRatingChange("question1", value)}
              />
            </div>

            {/* Question 2 */}
            <div className="question-container">
              <label>
                2. How effective did you find the search and filtering options
                for discovering resources?
              </label>
              <StarRating
                rating={ratings.question2}
                setRating={(value) => handleRatingChange("question2", value)}
              />
            </div>

            {/* Question 3 */}
            <div className="question-container">
              <label>
                3. How would you rate your experience while viewing and
                interacting with resources (e.g., previews, comments)?
              </label>
              <StarRating
                rating={ratings.question3}
                setRating={(value) => handleRatingChange("question3", value)}
              />
            </div>

            {/* Question 4 */}
            <div className="question-container">
              <label>
                4. How satisfied are you with the process of uploading and
                managing resources?
              </label>
              <StarRating
                rating={ratings.question4}
                setRating={(value) => handleRatingChange("question4", value)}
              />
            </div>

            {/* Question 5 */}
            <div className="question-container">
              <label>
                5. Overall, how likely are you to recommend the resource hub?
              </label>
              <StarRating
                rating={ratings.question5}
                setRating={(value) => handleRatingChange("question5", value)}
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              {userProfile.providedFeedback
                ? "Update Feedback"
                : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;
