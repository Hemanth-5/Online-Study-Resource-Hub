import Notification from "../models/notification.model.js";

// Create a new notification
const createNotification = async (req, res) => {
  const { content, recipient, sender, notificationType } = req.body;

  try {
    const notification = new Notification({
      content,
      recipient,
      sender, // Include sender info
      notificationType, // Indicates whether it's user or system
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get notifications for a specific user
const getUserNotifications = async (req, res) => {
  const userId = req.params.userId;

  try {
    const notifications = await Notification.find({ recipient: userId }).sort({
      createdAt: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mark notification as read
const markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createNotification, getUserNotifications, markAsRead };
