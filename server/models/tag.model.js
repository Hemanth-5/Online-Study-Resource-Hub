import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: [
        "department",
        "branch",
        "subject",
        "questionType",
        "semester",
        "batch",
      ],
      // enum for questionType => ["semester", "assessment", "tutorial"]
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
  },
  { timestamps: true }
);

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
