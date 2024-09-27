import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCaretDown,
  FaSearch,
  FaUser,
  FaDoorOpen,
} from "react-icons/fa";
import "./Header.css";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { setUserProfile } from "../features/userSlice";
import { setResources } from "../features/resourceSlice";
import { setTags } from "../features/tagSlice";
import { setNotifications } from "../features/notificationSlice";

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State to control profile options popup
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use useSelector to get notifications from Redux store
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );
  // console.log({ notifications });
  const userProfile = useSelector((state) => state.user.profile); // Get user profile from Redux store

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const onLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(setUserProfile(null));
    dispatch(setResources(null));
    dispatch(setTags(null));
    dispatch(setNotifications(null));

    navigate("/login");
  };

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate("/dashboard")}>
        Resource Hub
      </div>

      {/* <div className="header-left">
        <input type="text" placeholder="Search" className="search-bar" />
        <FaSearch className="search-icon" />
      </div> */}

      <div className="header-right">
        <div className="notification-container">
          <FaBell className="notification-icon" onClick={toggleNotifications} />
          {showNotifications && (
            <div className="notification-popup">
              {notifications && notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification._id} className="notification-item">
                    {notification.content}{" "}
                    {/* Adjust based on your notification structure */}
                  </div>
                ))
              ) : (
                <div className="notification-item">No new notifications</div>
              )}
            </div>
          )}
        </div>
        <div className="user-info">
          {userProfile && (
            <>
              <img
                src={userProfile.profilePicture}
                alt="Profile"
                className="profile-picture-small"
              />
              {/* A dropdown when clicking user name along with icon*/}
              <div className="user-name-dropdown" onClick={togglePopup}>
                <span className="user-name">{userProfile.name}</span>
                <FaCaretDown className="dropdown-icon" />
              </div>
            </>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="profile-popup">
          <Link to="/profile-completion" className="profile-option">
            Profile <FaUser className="profile-icon" />
          </Link>
          <div className="profile-option" onClick={onLogout}>
            Logout <FaDoorOpen className="logout-icon" />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
