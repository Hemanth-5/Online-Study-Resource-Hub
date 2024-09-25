import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      default: null,
    },
    username: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    name: {
      type: String,
    },
    department: {
      type: String,
    },
    bio: {
      gender: {
        type: String,
        enum: ["male", "female", "other"],
      },
      dob: {
        type: String,
      },
      alternateEmail: {
        type: String,
      },
      degree: {
        type: String,
      },
      batch: {
        type: String,
      },
    },
    profilePicture: {
      type: String,
      default: null,
    },
    profilePictureUploadId: {
      type: String,
      default: null,
    },
    isProfileComplete: { type: Boolean, default: false },
    uploadedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
      },
    ],
    studyGroups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "StudyGroup",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    interests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
        // type: String,
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
