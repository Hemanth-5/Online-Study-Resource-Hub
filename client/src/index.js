import React from "react";
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
import ProtectedRoute from "./components/ProtectedRoute"; // Import your ProtectedRoute
import Resources from "./pages/Resources";
import ViewResource from "./pages/ViewResource";
import UploadResource from "./pages/UploadResource";
import MyUploads from "./pages/MyUploads";
import RecentActivities from "./pages/RecentActivities";
import UserProfileView from "./pages/UserProfileView";
import AdminTagManagement from "./pages/Admin/AdminTagManagement";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
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
            {/* <Route
              path="/recent-activities"
              element={
                <ProtectedRoute>
                  <RecentActivities />
                </ProtectedRoute>
              }
            /> */}

            {/* Default redirect to login */}
            <Route path="/*" element={<Navigate to="/login" />} />

            {/* Admin routes*/}
            <Route path="/admin" element={<AdminTagManagement />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
