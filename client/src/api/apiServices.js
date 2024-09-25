import API_ENDPOINTS from "./apiEndpoints";

// Helper function to handle the response
const handleResponse = async (response) => {
  const jsonResponse = await response.json();

  if (!response.ok) {
    const error = new Error(jsonResponse.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }

  return jsonResponse;
};

// Generic function to perform fetch requests
const apiRequest = async (
  url,
  method,
  token,
  body = null,
  isFormData = false
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = isFormData ? body : JSON.stringify(body);
  }

  const response = await fetch(url, options);
  const jsonResponse = await handleResponse(response);

  // Handle 403 error and refresh token if necessary
  if (response.status === 403) {
    throw new Error("Token expired");
  }

  return jsonResponse;
};

// API service to log recent activity
const logRecentActivity = async (token, activityData) => {
  return apiRequest(
    API_ENDPOINTS.RECENT_ACTIVITIES.LOG,
    "POST",
    token,
    activityData
  );
};

// API service to get all recent activities (admin only)
const fetchAllRecentActivities = async (token) => {
  return apiRequest(API_ENDPOINTS.RECENT_ACTIVITIES.GET_ALL, "GET", token);
};

// API service to get recent activities by user ID
const fetchRecentActivitiesByUser = async (token, userId) => {
  return apiRequest(
    API_ENDPOINTS.RECENT_ACTIVITIES.GET_BY_USER(userId),
    "GET",
    token
  );
};

// API service to get recent activities by action type (like, comment, etc.)
const fetchRecentActivitiesByType = async (token, actionType) => {
  return apiRequest(
    API_ENDPOINTS.RECENT_ACTIVITIES.GET_BY_TYPE(actionType),
    "GET",
    token
  );
};

// Fetch user profile
const fetchUserProfile = async (token) => {
  return apiRequest(API_ENDPOINTS.USERS.PROFILE, "GET", token);
};

// Complete user profile
const completeProfile = async (token, profileData) => {
  const body = profileData;
  return apiRequest(API_ENDPOINTS.USERS.UPDATE_PROFILE, "PUT", token, body);
};

// Update profile picture
const updateProfilePicture = async (token, formData) => {
  return apiRequest(
    API_ENDPOINTS.USERS.UPDATE_PROFILE_PIC,
    "PUT",
    token,
    formData,
    true
  );
};

// Refresh access token
const refreshAccessToken = async (refreshToken) => {
  const body = { refreshToken };
  const response = await apiRequest(
    API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    "POST",
    null,
    body
  );
  return response; // Expect { accessToken, refreshToken }
};

// Upload resource
const uploadResource = async (token, formData) => {
  return apiRequest(
    API_ENDPOINTS.RESOURCES.UPLOAD,
    "POST",
    token,
    formData,
    true
  );
};

// Fetch user's uploaded resources
const fetchUserResources = async (token) => {
  return apiRequest(API_ENDPOINTS.RESOURCES.MY_RESOURCES, "GET", token);
};

// Browse resources
const browseResources = async (token) => {
  return apiRequest(API_ENDPOINTS.RESOURCES.BROWSE, "GET", token);
};

// Fetch all tags
const fetchAllTags = async (token) => {
  return apiRequest(API_ENDPOINTS.TAGS.BROWSE, "GET", token);
};

// Delete a resource by its ID
const deleteResource = async (token, resourceId) => {
  return apiRequest(
    API_ENDPOINTS.RESOURCES.DELETE(resourceId),
    "DELETE",
    token
  );
};

// Edit a resource by its ID
const editResource = async (token, resourceId, updatedData) => {
  return apiRequest(
    API_ENDPOINTS.RESOURCES.UPDATE(resourceId),
    "PUT",
    token,
    updatedData,
    true
  );
};

// Search and filter resources based on query, category, and access level
const searchAndFilterResources = async (token, filterParams) => {
  const { query, category, accessLevel } = filterParams;
  const queryParams = new URLSearchParams({ query, category, accessLevel });
  return apiRequest(
    `${API_ENDPOINTS.RESOURCES.SEARCH}?${queryParams.toString()}`,
    "GET",
    token
  );
};

// Fetch resource details by its ID
const fetchResourceDetails = async (token, id) => {
  return apiRequest(`${API_ENDPOINTS.RESOURCES.VIEW(id)}`, "GET", token);
};

// Fetch comments for a specific resource by its ID
const fetchCommentsForResource = async (token, resourceId) => {
  return apiRequest(
    `${API_ENDPOINTS.COMMENTS.DISPLAY(resourceId)}`,
    "GET",
    token
  );
};

// Add a new comment to a specific resource
const addCommentToResource = async (token, resourceId, commentText) => {
  const body = { text: commentText };
  return apiRequest(
    `${API_ENDPOINTS.COMMENTS.ADD(resourceId)}`,
    "POST",
    token,
    body
  );
};
// Export the new function
export {
  fetchUserProfile,
  completeProfile,
  updateProfilePicture,
  refreshAccessToken,
  uploadResource,
  fetchUserResources,
  browseResources,
  fetchAllTags,
  searchAndFilterResources,
  addCommentToResource,
  fetchResourceDetails,
  fetchCommentsForResource,
  deleteResource,
  editResource,
  logRecentActivity,
  fetchAllRecentActivities,
  fetchRecentActivitiesByUser,
  fetchRecentActivitiesByType,
};
