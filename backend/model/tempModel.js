
import mongoose, { model } from "mongoose";

const userTempSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    otp: { type: String, required : true},
    otpExpireAt: { type: Number, default: 0 },
    

    
})

const tempModel = mongoose.models.Temp || mongoose.model('Temp', userTempSchema);
// creates a new user model if it does not exist and if it exists then it uses that

export default tempModel;
