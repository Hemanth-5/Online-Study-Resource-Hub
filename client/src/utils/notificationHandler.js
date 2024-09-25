// src/utils/notificationHandler.js

import { useDispatch } from "react-redux";
import {
  createNotification,
  fetchUserNotifications,
  markNotificationAsRead,
} from "../api/apiServices";
import {
  setNotifications,
  setLoading,
  setError,
  addNotification,
  markNotificationAsRead as markNotificationAsReadAction,
} from "../features/notificationSlice";

// Initialize dispatch (this would ideally be inside a React component or custom hook)
const dispatch = useDispatch();

// Function to handle comment notification
const handleCommentNotification = async (
  token,
  userId,
  resourceId,
  commenterName
) => {
  const notificationData = {
    userId, // The user receiving the notification
    message: `${commenterName} commented on your resource.`,
    resourceId, // Optional: to link the notification to the specific resource
    type: "comment", // Notification type
    read: false, // New notifications are unread
  };

  try {
    const createdNotification = await createNotification(
      token,
      notificationData
    );
    dispatch(addNotification(createdNotification)); // Add notification to Redux state
  } catch (error) {
    console.error("Failed to create comment notification:", error);
  }
};

// Function to handle like notification
const handleLikeNotification = async (token, userId, resourceId, likerName) => {
  const notificationData = {
    userId, // The user receiving the notification
    message: `${likerName} liked your resource.`,
    resourceId, // Optional: to link the notification to the specific resource
    type: "like", // Notification type
    read: false, // New notifications are unread
  };

  try {
    const createdNotification = await createNotification(
      token,
      notificationData
    );
    dispatch(addNotification(createdNotification)); // Add notification to Redux state
  } catch (error) {
    console.error("Failed to create like notification:", error);
  }
};

// Function to fetch notifications for a user
const getUserNotifications = async (token, userId) => {
  dispatch(setLoading(true)); // Set loading state
  try {
    const notifications = await fetchUserNotifications(token, userId);
    dispatch(setNotifications(notifications)); // Update Redux state with fetched notifications
  } catch (error) {
    dispatch(setError(error.message)); // Update error in Redux state
    console.error("Failed to fetch user notifications:", error);
  } finally {
    dispatch(setLoading(false)); // Reset loading state
  }
};

// Function to mark a notification as read
const markAsRead = async (token, notificationId) => {
  try {
    await markNotificationAsRead(token, notificationId);
    dispatch(markNotificationAsReadAction(notificationId)); // Update Redux state
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
  }
};

export {
  handleCommentNotification,
  handleLikeNotification,
  getUserNotifications,
  markAsRead,
};
