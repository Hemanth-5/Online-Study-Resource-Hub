import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    isQuestionPaper: {
      type: Boolean,
      default: false,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    uploadId: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    category: {
      type: String,
      enum: ["book", "notes", "questionPapers", "other"],
      default: "other",
    },
    accessLevel: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
