import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import { setResources } from "../features/resourceSlice"; // Import resource actions
import { setTags } from "../features/tagSlice"; // Import tag actions
import { setNotifications } from "../features/notificationSlice";
import {
  fetchUserProfile,
  fetchUserResources,
  fetchAllTags,
  fetchUserNotifications,
} from "../api/apiServices"; // Import API services
import Popup from "../components/Popup"; // Assuming Popup component is available
import "./Login.css"; // Import the external CSS file

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const handleGoogleLogin = () => {
    console.log(`${process.env.REACT_APP_API_URL}/auth/google`);
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  };

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 5000); // Auto-close after 5 seconds
  };

  const closePopup = () => setPopup({ visible: false, message: "", type: "" });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    let name, newUser, userName;

    // console.log(accessToken);

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      window.history.replaceState({}, document.title, "/dashboard");
    }

    const token = accessToken || localStorage.getItem("accessToken");

    if (token) {
      dispatch(setLoading("loading"));
      // Fetch user profile
      fetchUserProfile(token)
        .then((userResponse) => {
          // console.log(userResponse);
          name = userResponse.name;
          newUser = userResponse.isProfileComplete;
          userName = userResponse.username;
          dispatch(setUserProfile(userResponse));
          return Promise.all([
            fetchUserResources(token),
            fetchAllTags(token),
            fetchUserNotifications(token, userResponse._id),
          ]); // Fetch resources and tags
        })
        .then(([resourcesResponse, tagsResponse, notificationResponse]) => {
          dispatch(setResources(resourcesResponse)); // Update resources state
          dispatch(setTags(tagsResponse)); // Update tags state
          dispatch(setNotifications(notificationResponse));

          // console.log({ resourcesResponse, tagsResponse });
          dispatch(setLoading("succeeded"));

          if (accessToken) {
            if (name) {
              showPopup(`Welcome back, ${name}!`, "success");
            } else if (newUser) {
              showPopup(`Welcome back!, ${userName}!`, "success");
            } else {
              showPopup(
                "Welcome to Study Resoure Hub, loading your profile...",
                "success"
              );
            }
            setTimeout(() => navigate("/dashboard"), 5000); // Redirect to dashboard after 3 seconds
          } else {
            navigate("/dashboard");
          }
          // navigate("/dashboard");
        })
        .catch((err) => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Redirect to login after showing the error
          navigate("/login");
        });
    } else {
      const error = params.get("error") || "Failed to fetch user data";
      const errorType = params.get("type") || null;
      if (
        error &&
        error === "google-auth" &&
        errorType &&
        errorType === "domain"
      ) {
        showPopup("Only PSG Tech students allowed", "failure");
      }

      // Redirect to login after showing the error
      setTimeout(() => navigate("/login"), 5000);
    }
  }, [dispatch, navigate, location.search]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">
          Welcome! Please login using your Google account.
        </p>
        <button className="login-button" onClick={handleGoogleLogin}>
          Login with Google
        </button>
      </div>

      {/* Display Popup when there's a failure */}
      {popup.visible && (
        <Popup message={popup.message} type={popup.type} onClose={closePopup} />
      )}
    </div>
  );
};

export default Login;
