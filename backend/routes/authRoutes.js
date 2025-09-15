import { signUp, signIn, sendForgotPasswordOtp, signOut, getProfile } from "../controller/authController.js";
import express from 'express';
import userAuth from "../middleware/authMiddlewear.js";

const authRouter = express.Router();

authRouter.post('/signUp', signUp);
authRouter.post('/signIn',signIn );
authRouter.post('/forgotPassword', sendForgotPasswordOtp);
authRouter.get('/signOut', signOut)

// Naryan thing
authRouter.get("/verify", userAuth, getProfile);

export default authRouter;