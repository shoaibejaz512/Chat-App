import UserModel from "../model/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { email, fullName, password, bio } = req.body;

  if (email == "" || fullName == "" || password == "" || bio == "") {
    return res.json({ success: false, message: "Missing Detials" });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account Already Exits" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await UserModel.create({
      email,
      fullName,
      password: hashedPassword,
      bio,
    });
    const token = generateToken(newUser._id);
    res.json({
      success: true,
      user: newUser, // ✅ unified key
      message: "Account Created Successfully",
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      userData: newUser,
      message: "Account not Created",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "somtheing went wrong" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "email or password is incorrect",
      });
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      user: user, // ✅ unified key
      message: "Account Created Successfully",
      token,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      userData: newUser,
      message: "Account not Created",
    });
  }
};

//controller to check user is Authenticated

export const checkAuth = async (req, res) => {
  res.json({ success: true, user: req.user });
};

//controller to update user profile and detialed

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let userUpdated;
    if (!profilePic) {
      userUpdated = await UserModel.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);

      userUpdated = await UserModel.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }
    res.status(200).json({ success: true, user: userUpdated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
