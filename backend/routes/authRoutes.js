import {  signIn, sendForgotPasswordOtp, signOut, getProfile, resetPassword, getOtp, verifySignUp } from "../controller/authController.js";
import express from 'express';
import userAuth from "../middleware/authMiddlewear.js";

const authRouter = express.Router();

authRouter.post('/verifySignUp', verifySignUp);
authRouter.post('/signIn',signIn );
authRouter.post('/forgotPassword', sendForgotPasswordOtp);
authRouter.get('/signOut', signOut);
authRouter.post('/resetPassword', resetPassword);
authRouter.post('/signUp', getOtp)

// Naryan thing
authRouter.get("/verify", userAuth, getProfile);

export default authRouter;