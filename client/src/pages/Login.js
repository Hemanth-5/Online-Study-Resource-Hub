import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserProfile, setLoading, setError } from "../features/userSlice";
import { setResources } from "../features/resourceSlice"; // Import resource actions
import { fetchUserProfile, fetchUserResources } from "../api/apiServices"; // Import API services
import Popup from "../components/Popup"; // Assuming Popup component is available
import "./Login.css"; // Import the external CSS file

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [popup, setPopup] = useState({ visible: false, message: "", type: "" });

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5001/api/auth/google";
  };

  const showPopup = (message, type) => {
    setPopup({ visible: true, message, type });
    setTimeout(() => setPopup({ visible: false, message: "", type: "" }), 5000); // Auto-close after 5 seconds
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");

    console.log(accessToken);

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
          dispatch(setUserProfile(userResponse));
          return Promise.all([fetchUserResources(token)]); // Fetch resources and tags
        })
        .then(([resourcesResponse]) => {
          dispatch(setResources(resourcesResponse)); // Update resources state

          // console.log({ resourcesResponse, tagsResponse });
          dispatch(setLoading("succeeded"));
          navigate("/dashboard");
        })
        .catch((err) => {
          console.error(err); // Log the error
          const errorMessage =
            err.response?.data?.message || "Failed to fetch data.";
          showPopup(errorMessage, "failure");
          dispatch(setError("Failed to fetch data."));
          dispatch(setLoading("failed"));
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          // Redirect to login after showing the error
          navigate("/login");
        });
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
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ visible: false, message: "", type: "" })}
        />
      )}
    </div>
  );
};

export default Login;
