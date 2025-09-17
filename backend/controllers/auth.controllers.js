import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";
export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, fullName } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Not a valid email" });
    }

    const existedUsername = await User.findOne({ username });
    if (existedUsername) {
      return res
        .status(400)
        .json({ success: false, message: "username already exist" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({
          success: false,
          message: "password must need atleast 6 characters long",
        });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: username,
      email: email,
      fullName: fullName,
      password: hashPassword,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(200).json({
        username: newUser.username,
        fullName: newUser.fullName,
        email: newUser.email,
        followers: newUser.followers,
        following: newUser.following,
        profileImg: newUser.profileImg,
        coverImg: newUser.coverImg,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error in signup:", error.message);
    res
      .status(500)
      .json({ success: false, message: `error in signup:${error.message}` });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const checkpassword = await bcrypt.compare(password, user?.password || "");

    if (!user || !checkpassword) {
      return res
        .status(400)
        .json({ success: false, message: "user not found" });
    }

    generateTokenAndSetCookie(user, res);

    return res.status(200).json({
      username: user.username,
      fullName: user.fullName,
      email: user.email,
      followers: user.followers,
      following: user.following,
      profileImg: user.profileImg,
      coverImg: user.coverImg,
    });
  } catch (error) {
    console.log(`error in login: ${error}`, error.message);
    res
      .status(500)
      .json({ success: false, message: `error in login: ${error}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "logut successful" });
  } catch (error) {
    console.log("error in logout:", error.message);
    res.status(500).json({ success: false, message: "error in logout" });
  }
};

export const getData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res
      .status(200)
      .json( user );
  } catch (error) {
    console.log("error in getData controller:", error.message);
    res
      .status(500)
      .json({ success: false, message: "error in getData controller" });
  }
};
