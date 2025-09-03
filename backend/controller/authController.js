import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import transporter from "../config/nodeMailer.js";


export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Credentials" });
        }

        const userEmail = await userModel.findOne({ email });
        if (userEmail) {
            return res.json({ success: false, message: "Your account already exists or this email arealy exists." })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({ name, email, password: hashedPassword });
            await user.save();


            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,
                { expiresIn: "7d" });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                sameSite: 'none',
                maxAge: 7 * 24 * 60 * 60 * 1000
            })

            return res.json({ success: true, message: "User signed up successfully." })

        }
        catch (error) {
            res.json({ success: false, message: error.message });
        }



    } catch (error) {
        res.json({ success: false, message: error.message });

    }
}