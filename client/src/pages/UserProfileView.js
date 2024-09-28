import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { viewUserProfile, fetchAllTags } from "../api/apiServices";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./UserProfileView.css";

const UserProfileView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.pathname.split("/").pop();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoadingState] = useState(true);
  const [error, setErrorState] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      navigate("/login");
      return;
    }

    viewUserProfile(token, userId)
      .then((response) => {
        setProfileData(response);
        setLoadingState(false);
      })
      .catch((err) => {
        setErrorState("Failed to fetch user profile.");
        setLoadingState(false);
      });
  }, [navigate, userId]);

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!profileData) {
    return <div>No profile data found.</div>;
  }

  return (
    <div className="user-profile-view-container">
      <Header />
      <div className="user-profile-view-main">
        <Navbar />
        <div className="user-profile-view-content">
          <h1>{profileData.name}'s Profile</h1>
          <div className="profile-photo-section">
            <img
              src={profileData.profilePicture || "defaultProfilePic.png"} // Provide a default image if none exists
              className="profile-photo"
              alt="Profile"
            />
          </div>
          <div className="profile-info">
            <div className="profile-detail">
              <strong>Email:</strong> {profileData.email}
            </div>
            <div className="profile-detail">
              <strong>Department:</strong> {profileData.department}
            </div>
            <div className="profile-detail">
              <strong>Gender:</strong> {profileData.bio?.gender}
            </div>
            <div className="profile-detail">
              <strong>Date of Birth:</strong> {profileData.bio?.dob}
            </div>
            <div className="profile-detail">
              <strong>Degree:</strong> {profileData.bio?.degree}
            </div>
            <div className="profile-detail">
              <strong>Batch:</strong> {profileData.bio?.batch}
            </div>
          </div>
          <div className="profile-interests">
            <strong>Interests:</strong>
            <div className="interests-list">
              {/* {profileData.interests.map((interest) => (
                <span key={interest} className="interest-tag">
                  {interest}
                </span>
              ))} */}
              {profileData.interests}
            </div>
          </div>
          {/* <div className="profile-analytics">
            <h2>Analytics</h2>
            <div className="analytics-detail">
              <strong>Posts:</strong> {profileData.analytics?.posts || 0}
            </div>
            <div className="analytics-detail">
              <strong>Followers:</strong>{" "}
              {profileData.analytics?.followers || 0}
            </div>
            <div className="analytics-detail">
              <strong>Following:</strong>{" "}
              {profileData.analytics?.following || 0}
            </div>
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileView;
