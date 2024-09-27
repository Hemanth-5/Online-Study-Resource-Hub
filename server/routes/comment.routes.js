import express from "express";
import {
  addComment,
  displayComments,
  deleteComment,
  replyToComment,
} from "../controllers/comment.controllers.js";

import { authenticateJWT } from "../middlewares/auth.js";

const router = express.Router();

router.route("/:id").post(authenticateJWT, addComment);
router.route("/:id").get(authenticateJWT, displayComments);
router.route("/delete/:id").delete(authenticateJWT, deleteComment);
router.route("/reply/:id").post(authenticateJWT, replyToComment);

export default router;
