// src/index.js

import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./app/store";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CompleteRegistration from "./pages/CompleteRegistration";
import ProtectedRoute from "./components/ProtectedRoute";
import Resources from "./pages/Resources";
import ViewResource from "./pages/ViewResource";
import UploadResource from "./pages/UploadResource";
import MyUploads from "./pages/MyUploads";
import UserProfileView from "./pages/UserProfileView";
import AdminTagManagement from "./pages/Admin/AdminTagManagement";
import DesktopSuggestionPopup from "./components/DesktopSuggestionPopup"; // Import the popup component
import { isMobileDevice } from "./utils/deviceUtils"; // Import the device detection function

const root = ReactDOM.createRoot(document.getElementById("root"));

const Index = () => {
  const [showDesktopSuggestion, setShowDesktopSuggestion] = useState(false);

  useEffect(() => {
    // Check if the device is mobile and set the popup to show
    if (isMobileDevice()) {
      setShowDesktopSuggestion(true);
    }
  }, []);

  const handleClosePopup = () => {
    setShowDesktopSuggestion(false);
  };

  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            {/* Desktop Suggestion Popup */}
            <DesktopSuggestionPopup
              show={showDesktopSuggestion}
              onClose={handleClosePopup}
            />

            {/* Application Routes */}
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <CompleteRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:userId"
                element={
                  <ProtectedRoute>
                    <UserProfileView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <Resources />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources/view/:resourceId"
                element={
                  <ProtectedRoute>
                    <ViewResource />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources/upload"
                element={
                  <ProtectedRoute>
                    <UploadResource />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-uploads"
                element={
                  <ProtectedRoute>
                    <MyUploads />
                  </ProtectedRoute>
                }
              />
              {/* Default redirect to login */}
              <Route path="/*" element={<Navigate to="/login" />} />

              {/* Admin routes */}
              <Route path="/admin" element={<AdminTagManagement />} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
};

root.render(<Index />);
