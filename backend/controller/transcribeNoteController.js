import noteModel from "../model/noteModel.js";
import { generateAIResponse } from "../services/gemini.js";
import quizModel from "../model/quizModel.js";
import transcribeModel from "../model/transcribeModel.js";

const saveTNotes = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
      return res.json({ success: false, message: "missing title or content" });
    }
    const beautifiedNotes = await generateAIResponse(content, false);
    // console.log(
    //   "This is coming from saveTNotes controller Ai notes",
    //   beautifiedNotes
    // );
    const transcribe = new transcribeModel({
      userId,
      title,
      content: beautifiedNotes,
    });
    await transcribe.save();
    res.json({ success: true, message: "Transcribe saved successfully." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const saveNotes = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

 
    if (!title || !content) {
      return res.json({ success: false, message: "Missing title or the note" });
    }

    const notes = new noteModel({ userId, title, content, type: "manual" });
    
    await notes.save();
    res.json({ success: true, message: "Notes saved to the database" });
  } catch (error) {
    console.error(" saveNotes error:", error);
    res.json({ success: false, message: error.message });
  }
};

const delNote = async (req, res) => {
  const { title } = req.params;
  const userId = req.user.id;

  try {
    // First try to delete from manual notes collection
    let note = await noteModel.findOneAndDelete({ userId, title });

    // If not found in manual notes, try transcribed notes collection
    if (!note) {
      note = await transcribeModel.findOneAndDelete({ userId, title });
    }

    // If still not found in either collection
    if (!note) {
      return res.json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, message: "Note deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getTranscribedNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const transcribedNotes = await transcribeModel
      .find({ userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, notes: transcribedNotes });
  } catch (err) {
    console.error(" getTranscribedNotes error:", err);
    return res.json({ success: false, message: err.message });
  }
};

const getSavedTNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    // console.log(" Fetching notes for userId:", userId);

    const manualNotes = await noteModel
      .find({ userId })
      .sort({ createdAt: -1 });
    

    const transcribedNotes = await transcribeModel
      .find({ userId })
      .sort({ createdAt: -1 });

    const allNotes = [
      ...manualNotes.map((note) => {
        const noteObj = note.toObject();
        return { ...noteObj, type: noteObj.type || "manual" };
      }),
      ...transcribedNotes.map((note) => {
        const noteObj = note.toObject();
        return { ...noteObj, type: noteObj.type || "transcribed" };
      }),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, notes: allNotes });
  } catch (err) {
    console.error(" getSavedTNotes error:", err);
    return res.json({ success: false, message: err.message });
  }
};

const getQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    // First try to find in manual notes
    let note = await noteModel.findOne({ userId, title });

    // If not found in manual notes, try transcribed notes
    if (!note) {
      note = await transcribeModel.findOne({ userId, title });
    }

    if (!note) {
      return res.json({
        success: false,
        message: "There are no notes with this title",
      });
    }

    const contents = note.content;

    const quiz = await generateAIResponse(contents, true);
    return res.json({ quiz });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const saveQuizScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, score } = req.body;

    if (!title || !score) {
      return res.json({ success: false, message: "missing title or score." });
    }
    const quiz = new quizModel({ userId, title, score });
    await quiz.save();

    return res.json({ success: true, message: "Score saved successfully." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const updateNote = async (req, res) => {
  try {
    const { noteId, title, content } = req.body;
    const userId = req.user.id;

    if (!noteId || !title || !content) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const note = await noteModel.findOneAndUpdate(
      { _id: noteId, userId },
      { title, content },
      { new: true }
    );

    if (!note) {
      return res.json({ success: false, message: "Note not found" });
    }

    res.json({ success: true, message: "Note updated successfully", note });
  } catch (error) {
    console.error(" updateNote error:", error);
    res.json({ success: false, message: error.message });
  }
};



const quizAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Missing title!" });
    }

    // sorts oldest to newest
    const quizzes = await quizModel.find({ userId, title }).sort({ createdAt: 1 }); 
    

    if (quizzes.length === 0) {
      return res.status(404).json({ success: false, message: "No quiz data found for this title." });
    }

    // returns array of scores and dates
    const data = quizzes.map(q => ({
      score: q.score,
      date: q.createdAt,
    }));

    return res.status(200).json({
      success: true,
      title,
      count: data.length,
      data, // array of { score, date }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export default quizAnalysis;



export {
  saveTNotes,
  saveNotes,
  getSavedTNotes,
  getTranscribedNotes,
  getQuiz,
  saveQuizScore,
  delNote,
  updateNote,
};
