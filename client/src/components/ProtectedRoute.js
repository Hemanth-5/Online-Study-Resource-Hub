import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Ensure you have jwt-decode installed
import { refreshAccessToken } from "../api/apiServices"; // Your function to refresh token

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Utility function to check if the token is expired or near expiration
  const isTokenExpiredOrNearExpiry = (token, offset = 60000) => {
    if (!token) return true; // No token means expired or not set
    const decoded = jwtDecode(token);
    const currentTime = Date.now();
    const expiryTime = decoded.exp * 1000; // `exp` is in seconds, convert to milliseconds
    return expiryTime - currentTime < offset; // True if the token will expire within `offset` milliseconds
  };

  // Function to handle user logout and navigation
  const dispatchLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch({ type: "user/logout" });
    alert("Session expired. Please log in again.");
    navigate("/login");
  };

  // Function to check and refresh tokens if needed
  const checkAndRefreshTokens = async () => {
    let accessToken = localStorage.getItem("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      dispatchLogout();
      return false;
    }

    // If access token is expired or near expiry, attempt to refresh it
    if (isTokenExpiredOrNearExpiry(accessToken)) {
      // Check if refresh token itself is expired
      if (isTokenExpiredOrNearExpiry(refreshToken)) {
        dispatchLogout();
        return false;
      } else {
        try {
          // Refresh the access token using the refresh token
          const newAccessToken = await refreshAccessToken(refreshToken);
          // Update the local storage and state with the new token
          localStorage.setItem("accessToken", newAccessToken.accessToken);
          setIsAuthenticated(true);
          return true;
        } catch (error) {
          console.error("Error refreshing access token:", error);
          dispatchLogout();
          return false;
        }
      }
    }

    setIsAuthenticated(true);
    return true;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await checkAndRefreshTokens();
      setIsAuthenticated(isValid);
    };

    checkAuth(); // Check authentication when the component loads

    // Set up an interval to check and refresh the token automatically
    const tokenCheckInterval = setInterval(() => {
      checkAndRefreshTokens();
    }, 30000); // Check every 30 seconds for token validity

    // Monitor localStorage changes to ensure consistency across tabs
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listeners and intervals on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(tokenCheckInterval);
    };
  }, [navigate, dispatch]);

  return isAuthenticated ? children : null; // Render children if authenticated, else null
};

export default ProtectedRoute;
