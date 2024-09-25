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
  },
});

// Export the action creators and the reducer
export const { setNotifications, setLoading, setError } =
  notificationSlice.actions;
export default notificationSlice.reducer;
