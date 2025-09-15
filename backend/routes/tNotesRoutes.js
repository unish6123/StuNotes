import express from 'express';
import  { saveTNotes, getSavedTNotes, getQuiz } from '../controller/transcribeNoteController.js'
import userAuth from '../middleware/authMiddlewear.js';

const tNotesRouter = express.Router();


tNotesRouter.post('/saveTranscribe',userAuth, saveTNotes);
tNotesRouter.get('/getNotes',userAuth, getSavedTNotes);
tNotesRouter.post('/getQuiz',userAuth, getQuiz);

export default tNotesRouter;