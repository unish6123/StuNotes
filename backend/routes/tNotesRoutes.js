import express from 'express';
import  { saveTNotes,saveNotes, getSavedTNotes, getQuiz, saveQuizScore,delNote } from '../controller/transcribeNoteController.js'
import userAuth from '../middleware/authMiddlewear.js';

const tNotesRouter = express.Router();


tNotesRouter.post('/saveTranscribeNotes',userAuth, saveTNotes);
tNotesRouter.get('/getNotes',userAuth, getSavedTNotes);
tNotesRouter.post('/getQuiz',userAuth, getQuiz);
tNotesRouter.post('/score', userAuth, saveQuizScore )
tNotesRouter.post('/saveNotes', userAuth, saveNotes)
tNotesRouter.delete('/deleteNote/:title', userAuth, delNote);

export default tNotesRouter;