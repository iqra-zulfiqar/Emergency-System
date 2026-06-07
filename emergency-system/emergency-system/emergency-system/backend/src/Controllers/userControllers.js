import bcrypt from "bcryptjs";
import { User } from "../Models/user.js";
import jwt from "jsonwebtoken";

// --- Register Regular User (No CV Required) ---
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Tamam fields fill karein!" , success : false});
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords match nahi ho rahe!" ,success : false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Yeh email pehle se registered hai!" , success : false });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      cv: null,
      role : 'user'
    });

    if (newUser) {
      const token = jwt.sign({ id: newUser._id , role : newUser.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "User registered and logged in successfully!",
        success : true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role : newUser.role,
        },
      });
    }
  } catch (error) {
    console.log("Detailed Backend Error:", error);
    res.status(500).json({ message: "Server mein koi masla aa gaya hai!" , success : false });
  }
};

// --- Register Service Provider (CV Required) ---
const registerServiceProvider = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Tamam fields fill karein!" , success : false});
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords match nahi ho rahe!" ,success : false });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Yeh email pehle se registered hai!" , success : false });
    }

    if (!req.file) {
      return res.status(400).json({ message: "CV upload karna lazmi hai!" , success : false});
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      cv: req.file.path,
      role : 'service-provider'
    });

    if (newUser) {
      const token = jwt.sign({ id: newUser._id , role : newUser.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({
        message: "Service Provider registered and logged in successfully!",
        success : true,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          cv: newUser.cv,
          role : newUser.role,
        },
      });
    }
  } catch (error) {
    console.log("Detailed Backend Error:", error);
    res.status(500).json({ message: "Server mein koi masla aa gaya hai!" , success : false });
  }
};

// --- Login User ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User nahi mila!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ghalat password!" });
    }

    const token = jwt.sign({ id: user._id , role : user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful!",
      success : true,
      user: { id: user._id, name: user.name, email: user.email , role : user.role},
    });
  } catch (error) {
    res.status(500).json({ message: error.message  , success : false});
  }
};

const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ message: "Logged out successfully!", success: true });
  } catch (error) {
    console.log("Logout Error" , error);
    return res.status(500).json({ message: "logout failed", success: false });
  }
};

export { loginUser, registerUser, registerServiceProvider, logoutUser };
