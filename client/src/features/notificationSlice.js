// src/features/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  status: "idle",
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    setLoading(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    addNotification(state, action) {
      state.notifications.push(action.payload); // Add a new notification
    },
    markNotificationAsRead(state, action) {
      const notificationId = action.payload;
      const notification = state.notifications.find(
        (n) => n.id === notificationId
      );
      if (notification) {
        notification.read = true; // Mark notification as read
      }
    },
  },
});

// Export the action creators and the reducer
export const {
  setNotifications,
  setLoading,
  setError,
  addNotification,
  markNotificationAsRead,
} = notificationSlice.actions;

export default notificationSlice.reducer;
