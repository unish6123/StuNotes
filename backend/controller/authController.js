import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.js";
import tempModel from "../model/tempModel.js";
import crypto from "crypto";

const getOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Credentials" });
    }
    const userEmail = await userModel.findOne({ email });
    if (userEmail) {
      return res.json({
        success: false,
        message: "Your account already exists or this email already exists.",
      });
    }

    const existingTemp = await tempModel.findOne({ email });
    if (existingTemp) {
      await tempModel.deleteOne({ email });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const otpExpireAt = Date.now() + 10 * 60 * 1000;

    const tempUser = await tempModel({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpireAt,
    });

    await tempUser.save();
    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to StuNotes 🎉",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
                  <div style="text-align: center; padding: 10px 0;">
                    <h1 style="color: #4CAF50;">Welcome to <span style="color: #2c3e50;">StuNotes</span> 🎓</h1>
                  </div>
                  <div style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                    <p style="font-size: 16px; color: #333;">Hello <b>${name}</b>,</p>
                    <p style="font-size: 15px; color: #555;">
                      Thank you for signing up with <b>${email} and your verification code is : <h2>${otp}</h2> </b>. 
                      We’re excited to have you on board and we’re confident StuNotes will make your study easier and more effective. 🚀
                    </p>
                    <p style="font-size: 15px; color: #555;">
                      Explore our resources, take notes, and organize your study better.
                    </p>
                    <div style="text-align: center; margin-top: 20px;">
                      <a href="https://stunotes.com" 
                         style="background: #4CAF50; color: white; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block; font-weight: bold;">
                        Get Started
                      </a>
                    </div>
                  </div>
                  <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
                    © ${new Date().getFullYear()} StuNotes. All rights reserved.
                  </p>
                </div>
              `,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const verifySignUp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.json({
        success: false,
        message: "Missing email or otp from frontend",
      });
    }

    const record = await tempModel.findOne({ email });
    if (!record) {
      return res.json({ success: false, message: "No OTP request found" });
    }

    if (record.otpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    const user = new userModel({
      name: record.name,
      email: record.email,
      password: record.password,
    });

    await user.save();

    await tempModel.deleteOne({ email });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      message: "User verified successfullly.",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email and password are required." });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "The user doesn't exist." });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // // Respond with user data and token
    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,

        id: user._id,
      },
      token,
    });
  } catch (error) {
    console.error("SignIn Error:", error);
    return res.status(422).json({ success: false, message: error.message });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "none",
      path: "/",
    });

    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    res.clearCookie("token", {
      path: "/",
    });

    return res.json({
      success: true,
      message: "User signed out successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    user.resetOtp = "";
    await user.save();

    if (!email) {
      return res.json({ success: false, message: "Missing email address." });
    }

    if (!user) {
      return res.json({ success: false, message: "This user doesn't exist." });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.resetOtp = otp;
    await user.save();
    user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000;

    await user.save();

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "🔐 StuNotes Password Reset Code",
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
            
            <!-- Header -->
            <div style="text-align: center; padding: 15px; background: #4CAF50; border-radius: 8px 8px 0 0;">
              <h2 style="color: white; margin: 0;">StuNotes Password Reset</h2>
            </div>
      
            <!-- Body -->
            <div style="background: #ffffff; padding: 25px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
              <p style="font-size: 16px; color: #333;">Hi <b>${
                user.name
              }</b>,</p>
      
              <p style="font-size: 15px; color: #555; line-height: 1.6;">
                You requested to reset your StuNotes account password. Use the verification code below:
              </p>
      
              <!-- OTP Box -->
              <div style="text-align: center; margin: 25px 0;">
                <span style="display: inline-block; font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #4CAF50; padding: 12px 20px; border: 2px dashed #4CAF50; border-radius: 8px;">
                  ${otp}
                </span>
              </div>
      
              <p style="font-size: 14px; color: #555;">
                This code will expire in <b>5 minutes</b>. Please do not share this code with anyone.
              </p>
      
              <p style="font-size: 14px; color: #999; margin-top: 20px;">
                If you didn’t request this, you can ignore this email safely.
              </p>
            </div>
      
            <!-- Footer -->
            <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 15px;">
              © ${new Date().getFullYear()} StuNotes. All rights reserved.
            </p>
          </div>
        `,
    });

    return res.json({
      success: true,
      message: `Verification otp sent to your email.`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("-password"); // exclude password
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    // console.log('The otp that we got from front end is ', otp, "And the resetOtp in database is ", user.resetOtp)

    if (!user || !otp || !newPassword) {
      return res.json({
        success: false,
        message: "User is not register with this account. ",
      });
    }
    if (user.resetOtp === "" || otp !== user.resetOtp) {
      return res.json({
        success: false,
        message: `invalidOtp from database = ${user.resetOtp} and form frontend ${otp}`,
      });
    }
    if (Date.now() > user.resetOtpExpireAt) {
      return res.json({ success: false, message: "Otp is expired." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    user.save();

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export {
  signOut,
  signIn,
  sendForgotPasswordOtp,
  getProfile,
  resetPassword,
  getOtp,
  verifySignUp,
};
