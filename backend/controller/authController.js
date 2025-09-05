import userModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import transporter from "../config/nodeMailer.js";


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

            await transporter.sendMail({
                from: process.env.SENDER_EMAIL,
                to: email,
                subject: 'Welcome to StuNotes 🎉',
                html: `
                  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; background: #f9f9f9; padding: 20px; border-radius: 10px;">
                    <div style="text-align: center; padding: 10px 0;">
                      <h1 style="color: #4CAF50;">Welcome to <span style="color: #2c3e50;">StuNotes</span> 🎓</h1>
                    </div>
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                      <p style="font-size: 16px; color: #333;">Hello <b>${name}</b>,</p>
                      <p style="font-size: 15px; color: #555;">
                        Thank you for signing up with <b>${email}</b>. 
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
                `
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

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  try {
      const user = await userModel.findOne({ email });

      if (!user) {
          return res.status(401).json({ success: false, message: "The user doesn't exist." });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
          return res.status(401).json({ success: false, message: "Invalid password." });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' });

      // Set the cookie
      res.cookie('token', token, {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // // Respond with user data and token
      return res.status(200).json({
          user: {
              name: user.name,
              email: user.email,
              
              id: user._id
          },
          token
      });;

  } catch (error) {
      console.error("SignIn Error:", error);
      return res.status(422).json({ success: false, message: error.message });
  }
};


const signOut = async (req, res) => {
  try {
      res.clearCookie('token', {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'none',
      })

      return res.json({ succes: true, message: "User signed out successfully." })

  }
  catch (error) {
      res.json({ success: false, message: error.message });
  }
}

export {
  signOut
}