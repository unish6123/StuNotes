import { signUp, signIn } from "../controller/authController.js";
import express from 'express';

const authRouter = express.Router();

authRouter.post('/signUp', signUp);
authRouter.post('/signIn',signIn )

export default authRouter;