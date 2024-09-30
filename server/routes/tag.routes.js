import express from "express";
import {
  browseAllTags,
  createTag,
  assignTags,
  removeTags,
  deleteTag,
} from "../controllers/tag.controllers.js";

import { authenticateJWT, verifyAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.route("/browse").get(authenticateJWT, browseAllTags);
router.route("/create").post(authenticateJWT, verifyAdmin, createTag);

// Assign tags: params: modelType, objectId of an instance of provided model
router.route("/assign/:type/:id").put(authenticateJWT, assignTags);
// Remove tags: params: modelType, objectId of an instance of provided model
router.route("/remove/:type/:id").put(authenticateJWT, removeTags);

router.route("/:id").delete(authenticateJWT, verifyAdmin, deleteTag);

export default router;
