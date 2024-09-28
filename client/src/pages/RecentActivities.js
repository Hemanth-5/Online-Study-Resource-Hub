import React, { useState, useEffect } from "react";
import {
  fetchRecentActivitiesByUser,
  fetchRecentActivitiesByType,
} from "../api/apiServices";
import { useSelector } from "react-redux"; // Import the useSelector hook from react-redux
import "./RecentActivities.css"; // Import the stylesheet for styling
import Header from "../components/Header";
import Navbar from "../components/Navbar";

const RecentActivities = () => {
  const token = localStorage.getItem("accessToken");
  const userProfile = useSelector((state) => state.user.profile);

  const [activities, setActivities] = useState([]);
  const [filter, setFilter] = useState(""); // To store the selected filter
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user activities on component load or when filter changes
    const fetchActivities = async () => {
      setLoading(true);
      try {
        let response;
        if (filter) {
          response = await fetchRecentActivitiesByType(token, filter);
        } else {
          response = await fetchRecentActivitiesByUser(token, userProfile._id);
        }
        setActivities(response.activities);
      } catch (error) {
        console.error("Failed to fetch activities", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [filter, token]);

  const filters = [
    "login",
    "logout",
    "upload",
    "like",
    "comment",
    "view",
    "joinGroup",
    "updateProfile",
    "download",
  ];

  return (
    <div className="recent-activities-container">
      <Header />
      <div className="recent-activities-main">
        <Navbar />
        <div className="recent-activities-content">
          <h2>Your Recent Activities</h2>

          <div className="pill-filter-container">
            {filters.map((actionType) => (
              <button
                key={actionType}
                className={`pill-filter ${
                  filter === actionType ? "active" : ""
                }`}
                onClick={() =>
                  setFilter(filter === actionType ? "" : actionType)
                }
              >
                {actionType}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading activities...</p>
          ) : activities.length === 0 ? (
            <p>No activities found.</p>
          ) : (
            <ul className="activity-list">
              {activities.map((activity) => (
                <li key={activity._id} className="activity-item">
                  <span className="activity-type">{activity.actionType}</span>
                  <span className="activity-description">
                    {activity.description}
                  </span>
                  <span className="activity-timestamp">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;
