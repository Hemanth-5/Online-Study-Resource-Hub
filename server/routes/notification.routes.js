import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
} from "../controllers/notification.controllers.js";
import { authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();

// Create a new notification
router.route("/").post(authenticateJWT, createNotification);

// Get notifications for a specific user
router.route("/:userId").get(authenticateJWT, getUserNotifications);

// Mark notification as read
router.route("/:notificationId/read").put(authenticateJWT, markAsRead);

export default router;
