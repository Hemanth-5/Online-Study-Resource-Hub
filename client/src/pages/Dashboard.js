import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import { setResources } from "../features/resourceSlice";
import {
  fetchUserProfile,
  refreshAccessToken,
  fetchUserResources,
} from "../api/apiServices";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Popup from "../components/Popup";
import "./Dashboard.css";

const Dashboard = () => {
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });
  const dispatch = useDispatch();
  const userProfile = useSelector((state) => state.user.profile);
  const userStatus = useSelector((state) => state.user.status);
  const navigate = useNavigate();
  const location = useLocation();

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 3000);
  };

  const closePopup = () => setPopup({ visible: false, message: "", type: "" });

  useEffect(() => {
    const handleTokenManagement = async () => {
      let token = localStorage.getItem("accessToken");
      let refreshToken = localStorage.getItem("refreshToken");

      if (!userProfile && userStatus === "idle") {
        dispatch(setLoading("loading"));
        try {
          const response = await fetchUserProfile(token);
          dispatch(setUserProfile(response));
          dispatch(setLoading("succeeded"));

          const userResources = await fetchUserResources(token);
          dispatch(setResources(userResources));
          if (response.name) {
            showPopup(`Welcome back, ${response.name}!`, "success");
          } else {
            showPopup("Welcome back!", "success");
          }
        } catch (err) {
          if (err.message === "Token expired") {
            try {
              const newTokens = await refreshAccessToken(refreshToken);
              localStorage.setItem("accessToken", newTokens.accessToken);
              const response = await fetchUserProfile(newTokens.accessToken);
              dispatch(setUserProfile(response));
              dispatch(setLoading("succeeded"));

              const userResources = await fetchUserResources(
                newTokens.accessToken
              );
              dispatch(setResources(userResources));
            } catch (refreshErr) {
              dispatch(setError("Failed to refresh token."));
              dispatch(setLoading("failed"));
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              navigate("/login");
            }
          } else {
            dispatch(setError("Failed to fetch user profile."));
            dispatch(setLoading("failed"));
          }
        }
      }
    };
    handleTokenManagement();
  }, [dispatch, navigate, userProfile, userStatus]);

  useEffect(() => {
    if (userProfile && !userProfile.isProfileComplete) {
      navigate("/profile");
    }
  }, [userProfile, navigate]);

  if (userStatus === "loading")
    return <div className="loading-screen">Loading...</div>;
  if (userStatus === "failed")
    return <div className="error-screen">Error loading profile.</div>;

  return (
    <div className="dashboard-container">
      <Header userProfile={userProfile} />

      {popup.visible && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
      )}

      <div className="dashboard-main">
        <Navbar />

        <main className="dashboard-content">
          <section className="welcome-section">
            <div className="welcome-text">
              <h1>Welcome, {userProfile?.name}!</h1>
              <p>Manage your resources, view study groups, and more.</p>
            </div>
            <div className="welcome-image">
              <img
                src={userProfile?.profilePicture}
                alt="User Avatar"
                className="profile-avatar"
              />
            </div>
          </section>

          <section className="quick-stats">
            <div className="stat-card">
              <h2>Resources</h2>
              <p>Manage and view your resources.</p>
            </div>
            <div className="stat-card">
              <h2>Study Groups</h2>
              <p>Join or create study groups.</p>
            </div>
            <div className="stat-card">
              <h2>Notifications</h2>
              <p>Check your recent notifications.</p>
            </div>
          </section>

          <section className="recent-activities">
            <h2>Recent Activities</h2>
            <div className="activities-list">
              <p>No recent activities to show.</p>
            </div>
          </section>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default Dashboard;
