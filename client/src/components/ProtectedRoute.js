import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode"; // Ensure you have jwt-decode installed
import { refreshAccessToken } from "../api/apiServices"; // Your function to refresh token

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isTokenExpired = (token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Check if token has expired
  };

  const dispatchLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch({ type: "user/logout" });
    alert("Session expired. Please log in again.");
    navigate("/login");
  };

  const checkTokens = async () => {
    let accessToken = localStorage.getItem("accessToken");
    let refreshToken = localStorage.getItem("refreshToken");

    if (!accessToken || !refreshToken) {
      dispatchLogout();
      return false;
    }

    if (isTokenExpired(accessToken)) {
      if (isTokenExpired(refreshToken)) {
        dispatchLogout();
        return false;
      } else {
        try {
          // Refresh the access token
          const newAccessToken = await refreshAccessToken(refreshToken);
          alert("Refreshed");
          localStorage.setItem("accessToken", newAccessToken.accessToken);
        } catch (error) {
          dispatchLogout();
          return false;
        }
      }
    }

    return true;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await checkTokens();
      setIsAuthenticated(isValid);
    };

    checkAuth(); // Check authentication when the component loads

    const handleStorageChange = () => {
      checkAuth(); // Recheck tokens when localStorage changes
    };

    window.addEventListener("storage", handleStorageChange); // Monitor localStorage

    return () => {
      window.removeEventListener("storage", handleStorageChange); // Cleanup
    };
  }, [navigate, dispatch]);

  return isAuthenticated ? children : null; // Render children if authenticated, else null
};

export default ProtectedRoute;
