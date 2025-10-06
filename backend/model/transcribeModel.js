import mongoose from "mongoose";

const transcribeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: { type: String, default: "transcribed" },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "transcribes" }
);

delete mongoose.models.Transcribe;
const transcribeModel = mongoose.model("Transcribe", transcribeSchema);

export default transcribeModel;
