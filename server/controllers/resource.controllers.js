import Resource from "../models/resource.model.js";
import User from "../models/user.model.js";
import Tag from "../models/tag.model.js";

import { uploadResourcesToCloudinary } from "../utils/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

// For admin
// Get, delete resources
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    await cloudinary.v2.uploader.destroy(resource.uploadId);
    await Resource.findByIdAndDelete(resource._id);
    await User.findByIdAndUpdate(resource.uploadedBy, {
      $pull: { uploadedResources: resource._id },
    });

    res.status(200).json({ message: "Resource deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For user
// browse resources, update resource file, delete their resource file
const browseResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate({
      path: "uploadedBy",
      select: ["name", "profilePicture"],
    });
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyResources = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const resources = await Resource.find({
      uploadedBy: currentUser._id,
    });

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateResourceFile = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    // console.log(currentUser);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentResource = await Resource.findById(req.params.id);
    if (!currentResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (!currentUser.uploadedResources.includes(currentResource._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { description, tags, category, accessLevel } = req.body;
    const file = req.file;

    // Delete exisiting file from cloudinary
    const result = {
      public_id: currentResource.uploadId,
      url: currentResource.fileUrl,
      fileName: currentResource.fileName,
    };

    // console.log(file);
    if (file) {
      if (file.originalname !== currentResource.fileName) {
        await cloudinary.v2.uploader.destroy(currentResource.uploadId);
        const newResult = await uploadResourcesToCloudinary(req, file.buffer);
        result.public_id = newResult.public_id;
        result.url = newResult.secure_url;
        result.fileName = file.originalname;
      } else {
        return res.status(400).json({ message: "File already exists" });
      }
    }

    // Check if there is a file included
    await Resource.findByIdAndUpdate(
      currentResource._id,
      {
        description,
        fileName: result.fileName,
        uploadId: result.public_id,
        fileUrl: result.url,
        tags,
        category,
        accessLevel,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Resource updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteResourceFile = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentResource = await Resource.findById(req.params.id);
    if (!currentUser.uploadedResources.includes(currentResource._id)) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await cloudinary.v2.uploader.destroy(currentResource.uploadId);
    await Resource.findByIdAndDelete(currentResource._id);
    await User.findByIdAndUpdate(currentUser._id, {
      $pull: { uploadedResources: currentResource._id },
    });

    // Add deletion of empty folder logic

    res.status(200).json({ message: "Resource deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // For faculty
// // Share their own study materials
// const shareResource = async (req, res) => {
//   try {
//     createResource(req, res);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// For all
// Create, update, delete their resources, Search resources, filter resources, manage resource access, assign resource
const createResource = async (req, res) => {
  try {
    // Create resource and upload it to cloudinary
    const uploader = await User.findById(req.user.id);

    if (!uploader) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileName = req.file.originalname;
    // Check whether the user already uplaods the file
    const existingResource = await Resource.findOne({
      fileName,
      uploadedBy: uploader._id,
    });

    if (existingResource) {
      return res.status(400).json({ message: "File already exists" });
    }

    // Upload the file to Cloudinary
    const result = await uploadResourcesToCloudinary(req, req.file.buffer);
    const { description, tags, category, accessLevel } = req.body;

    console.log(req.body);

    const newResource = new Resource({
      fileName,
      fileUrl: result.url,
      uploadedBy: uploader._id,
      uploadId: result.public_id,
      description,
      tags,
      category,
      accessLevel,
    });

    const savedResource = await newResource.save();

    uploader.uploadedResources.push(savedResource._id);
    await uploader.save();

    res.status(201).json({ message: "Resource created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const searchAndFilterResources = async (req, res) => {
  try {
    const { query = "", category, accessLevel } = req.query;

    // Step 1: Find tag IDs by name if query is present
    let tagIds = [];
    if (query) {
      const tags = await Tag.find({ name: { $regex: query, $options: "i" } });
      tagIds = tags.map((tag) => tag._id);
    }

    // Step 2: Build search criteria
    const searchCriteria = {
      $and: [
        {
          $or: [
            { fileName: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
          ],
        },
        category ? { category } : {},
        accessLevel ? { accessLevel } : {},
        tagIds.length > 0 ? { tags: { $in: tagIds } } : {}, // Match if any tag is in the resource's tags
      ],
    };

    const resources = await Resource.find(searchCriteria);

    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const manageResourceAccess = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    if (resource.uploadedBy.toString() !== req.user.id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { accessLevel } = req.body;
    await Resource.findByIdAndUpdate(
      resource._id,
      { accessLevel },
      { new: true }
    );

    res.status(200).json({ message: "Resource access updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller for liking a resource
const likeResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (resource.likes.includes(currentUser._id)) {
      return res.status(400).json({ message: "Resource already liked" });
    }

    await Resource.findByIdAndUpdate(
      resource._id,
      { $push: { likes: currentUser._id } },
      { new: true }
    );

    res.status(200).json({ message: "Resource liked" });

    // Add notification logic
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const viewResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Add view count logic
    res.status(200).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const assignResource = async (req, res) => {};

export {
  getResources,
  getResource,
  deleteResource,
  browseResources,
  updateResourceFile,
  deleteResourceFile,
  createResource,
  searchAndFilterResources,
  manageResourceAccess,
  likeResource,
  getMyResources,
  viewResource,
};
