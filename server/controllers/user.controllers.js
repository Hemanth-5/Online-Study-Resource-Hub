import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { uploadProfilePicturesToCloudinary } from "../utils/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

// Controllers for user profile management, not by admin

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    // console.log({ user });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    // console.log({ user });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    // console.log({ body: req.body });

    // Add new fields to the allowed updates array
    const allowedUpdates = [
      "username",
      "password",
      "name",
      "department",
      "interests",
      "bio",
      "gender", // New field
      "dob", // New field
      "alternateEmail", // New field
      "degree", // New field
      "batch", // New field
      "isProfileCompleted",
    ];

    const updateFields = {};

    // Capture the fields to be updated
    allowedUpdates.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    // Hash the password if it's being updated
    if (updateFields.password) {
      updateFields.password = await bcryptjs.hash(updateFields.password, 10);
    }

    // Find and update the user by ID
    const updatedProfile = await User.findByIdAndUpdate(
      req.user.id,
      { ...updateFields, isProfileComplete: true },
      { new: true }
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Profile updated", updatedProfile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controllers for user management, by admin

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user by ID (Admin Route)
const updateUser = async (req, res) => {
  try {
    // Add new fields to the allowed updates array
    const allowedUpdates = [
      "username",
      "password",
      "email",
      "role",
      "name",
      "department",
      "bio",
      "uploadedResources",
      "studyGroups",
      "notifications",
      "gender", // New field
      "dob", // New field
      "alternateEmail", // New field
      "degree", // New field
      "batch", // New field
      "isProfileComplete",
    ];

    const updateFields = {};

    // Capture the fields to be updated
    allowedUpdates.forEach((field) => {
      if (req.body[field]) {
        updateFields[field] = req.body[field];
      }
    });

    // Hash the password if it's being updated
    if (updateFields.password) {
      updateFields.password = await bcryptjs.hash(updateFields.password, 10);
    }

    // Find and update the user by ID
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user's profile picture from Cloudinary
    if (user.profilePictureUploadId) {
      await cloudinary.v2.uploader.destroy(user.profilePictureUploadId);
    }
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile picture
const updateUserProfilePic = async (req, res) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure that a file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Upload the file to Cloudinary
    const result = await uploadProfilePicturesToCloudinary(
      req,
      req.file.buffer
    );

    // Update the user's profile picture URL
    user.profilePicture = result.secure_url;
    user.profilePictureUploadId = result.public_id;
    await user.save();

    // Send a success response
    res.status(200).json({ message: "Profile picture updated" });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  updateUserProfilePic,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  viewProfile,
};
