import { signUp, signIn, sendForgotPasswordOtp, signOut } from "../controller/authController.js";
import express from 'express';

const authRouter = express.Router();

authRouter.post('/signUp', signUp);
authRouter.post('/signIn',signIn );
authRouter.post('/forgotPassword', sendForgotPasswordOtp);
authRouter.get('/signOut', signOut)

export default authRouter;