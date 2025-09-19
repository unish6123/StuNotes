import express from 'express';
import  { saveTNotes, getSavedTNotes, getQuiz, saveQuizScore } from '../controller/transcribeNoteController.js'
import userAuth from '../middleware/authMiddlewear.js';

const tNotesRouter = express.Router();


tNotesRouter.post('/saveNotes',userAuth, saveTNotes);
tNotesRouter.get('/getNotes',userAuth, getSavedTNotes);
tNotesRouter.post('/getQuiz',userAuth, getQuiz);
tNotesRouter.post('/score', userAuth, saveQuizScore )

export default tNotesRouter;