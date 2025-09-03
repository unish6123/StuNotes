import { signUp } from "../controller/authController.js";
import express from 'express';

const authRouter = express.Router();

authRouter.post('/signUp', signUp);

export default authRouter;