import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, enum: ["manual", "transcribed"], default: "manual" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "notes" }
);

delete mongoose.models.Note;
const noteModel = mongoose.model("Note", noteSchema);

export default noteModel;
