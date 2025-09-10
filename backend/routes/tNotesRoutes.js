import express from 'express';
import saveTNotes from '../controller/transcribeNoteController.js'
import userAuth from '../middlewear/authMiddlewear.js';

const tNotesRouter = express.Router();


tNotesRouter.post('/saveTranscribe',userAuth, saveTNotes);

export default tNotesRouter;