import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    notificationType: {
      type: String,
      enum: ["user", "system"], // Allow only 'user' or 'system'
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      // Add a sender field to identify who sent the notification
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
