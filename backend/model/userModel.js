
import mongoose, { model } from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    verifyOtp: { type: String, default: 0 },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },

    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
})

const userModel = mongoose.models.user || mongoose.model('User', userSchema);
// creates a new user model if it does not exist and if it exists then it uses that

export default userModel;
