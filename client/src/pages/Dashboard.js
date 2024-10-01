import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
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
  let resources = useSelector((state) => state.resource.resources);

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 3000);
  };

  const closePopup = () => setPopup({ visible: false, message: "", type: "" });

  const fetchAndUpdateData = async () => {
    let token = localStorage.getItem("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetchUserProfile(token);
      dispatch(setUserProfile(response));

      const userResources = await fetchUserResources(token);
      dispatch(setResources(userResources));

      if (response.name) {
        if (
          location.pathname !== "/dashboard" &&
          localStorage.getItem("accessToken")
        ) {
          showPopup(`Welcome back, ${response.name}!`, "success");
        }
      } else {
        showPopup("Welcome back!", "success");
      }
    } catch (err) {
      if (err.message === "Token expired") {
        try {
          const newTokens = await refreshAccessToken(refreshToken);
          localStorage.setItem("accessToken", newTokens.accessToken);
          await fetchAndUpdateData(); // Retry fetching data with the new token
        } catch (refreshErr) {
          dispatch(setError("Failed to refresh token."));
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/login");
        }
      } else {
        dispatch(setError("Failed to fetch user profile."));
      }
    }
  };

  useEffect(() => {
    fetchAndUpdateData(); // Initial fetch

    const intervalId = setInterval(fetchAndUpdateData, 60000); // Fetch data every 60 seconds

    return () => clearInterval(intervalId); // Clean up on unmount
  }, [dispatch, navigate]);

  useEffect(() => {
    if (userProfile && !userProfile.isProfileComplete) {
      navigate("/profile");
    }
  }, [userProfile, navigate]);

  const userResources = userProfile?.uploadedResources?.length
    ? resources.filter((resource) =>
        userProfile.uploadedResources.includes(resource._id)
      )
    : [];

  const topLikedResources = userResources
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 3); // Get top 3 liked resources

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
              <h2>Your top liked resources...</h2>
              {topLikedResources.length > 0 ? (
                topLikedResources.map((resource) => (
                  <div
                    key={resource._id}
                    className="resource-item"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <strong>
                      <Link to={`/resources/view/${resource._id}`}>
                        {resource.fileName}
                      </Link>
                    </strong>
                    <p>
                      {resource?.likes?.length < 2
                        ? `${resource?.likes?.length} like`
                        : `${resource?.likes?.length} likes`}
                    </p>
                  </div>
                ))
              ) : (
                <p>
                  No resources to show.{" "}
                  <Link to="/my-uploads">Click here to upload...</Link>
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
