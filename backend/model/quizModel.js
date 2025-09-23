import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  score: { type: Number, required: true, min: 0 }, 
  createdAt: { type: Date, default: Date.now }
});

const quizModel = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

export default quizModel;
