import express from "express";
import {
  saveTNotes,
  saveNotes,
  getSavedTNotes,
  getTranscribedNotes,
  getQuiz,
  saveQuizScore,
  quizAnalysis,
  updateNote,
  delNote,
} from "../controller/transcribeNoteController.js";
import userAuth from "../middleware/authMiddlewear.js";

const tNotesRouter = express.Router();

tNotesRouter.post("/saveTranscribeNotes", userAuth, saveTNotes);
tNotesRouter.get("/getTranscribedNotes", userAuth, getTranscribedNotes);
tNotesRouter.get("/getNotes", userAuth, getSavedTNotes);
tNotesRouter.post("/getQuiz", userAuth, getQuiz);
tNotesRouter.post("/score", userAuth, saveQuizScore);
tNotesRouter.post("/quizAnalysis", userAuth, quizAnalysis);
tNotesRouter.post("/saveNotes", userAuth, saveNotes);
tNotesRouter.put("/updateNote", userAuth, updateNote);
tNotesRouter.delete("/deleteNote/:title", userAuth, delNote);

export default tNotesRouter;
