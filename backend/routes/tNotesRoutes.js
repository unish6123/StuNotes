import express from 'express';
import  { saveTNotes, getSavedTNotes } from '../controller/transcribeNoteController.js'
import userAuth from '../middlewear/authMiddlewear.js';

const tNotesRouter = express.Router();


tNotesRouter.post('/saveTranscribe',userAuth, saveTNotes);
tNotesRouter.get('/getNotes',userAuth, getSavedTNotes);

export default tNotesRouter;