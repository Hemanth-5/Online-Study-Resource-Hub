import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tags: [], // Store fetched tags here
  status: "idle", // idle | loading | succeeded | failed
  error: null, // Store any errors
};

const tagSlice = createSlice({
  name: "tag",
  initialState,
  reducers: {
    setTags(state, action) {
      state.tags = action.payload; // Update the tags in state
    },
    addTag(state, action) {
      state.tags.push(action.payload); // Add a new tag (if needed)
    },
    removeTag(state, action) {
      state.tags = state.tags.filter((tag) => tag._id !== action.payload); // Remove a tag
    },
    setLoading(state, action) {
      state.status = action.payload; // Update loading status
    },
    setError(state, action) {
      state.error = action.payload; // Update error state
    },
  },
});

export const { setTags, addTag, removeTag, setLoading, setError } =
  tagSlice.actions;

export default tagSlice.reducer;
