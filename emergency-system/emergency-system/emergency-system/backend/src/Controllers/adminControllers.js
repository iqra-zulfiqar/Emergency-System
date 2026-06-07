import { Admin } from "../Models/admin.js"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 1. Admin Registration
const registerAdmin = async (req, res) => {
  try {
    // Ab hum sirf wahi data le rahe hain jo aapne Signup form mein rakha hai
    const { name, email, password, phone, address } = req.body;

    // Check karein ke email pehle se exist to nahi karti
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Is email se account pehle se majood hai!" });
    }

    // Password Hash (Security ke liye zaroori hai)
    const hashedPassword = await bcrypt.hash(password, 10);

    // CV file path (agar file upload hui ho to)
    const cvPath = req.file ? req.file.path : null;

    const newAdmin = new Admin({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      cv: cvPath,
      role: "admin"
    });

    await newAdmin.save();
    res.status(201).json({ message: "Admin account successfully register ho gaya!"  , newAdmin :{
      id : newAdmin._id,
      name : newAdmin.name,
      email: newAdmin.email,
      role : newAdmin.role,
      cv: newAdmin.cv
    }, role: "admin", success: true });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ message: "Registration mein koi masla aya hai." });
  }
};

// 2. Admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Account nahi mila!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ghalat password!" });
    }

    // JWT Token creation
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      "ZainSecretKey", // Isay .env mein hona chahiye
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful!",
      success : true,
      admin: {
        id: String(admin._id),
        name: admin.name,
        role: admin.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Login fail ho gaya!" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    // Agar aap cookies use kar rahe hain to cookie clear karein
    res.clearCookie('token'); 
    res.status(200).json({ message: "Logged out successfully" , success : true });
  } catch (error) {
    res.status(500).json({ message: "Logout failed" , success : false });
  }
};

// Get all service providers
const getAllServiceProviders = async (req, res) => {
  try {
    const providers = await Admin.find({ role: "admin" }).select("name email phone address");
    res.status(200).json({
      success: true,
      providers
    });
  } catch (error) {
    console.error("Error fetching service providers:", error);
    res.status(500).json({ 
      success: false,
      message: "Service providers fetch mein masla aya hai." 
    });
  }
};

// Delete specific service providers by email
const deleteServiceProviders = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Emails array zaroori hai"
      });
    }

    const result = await Admin.deleteMany({ email: { $in: emails } });

    res.status(200).json({
      success: true,
      message: `${result.deletedCount} service provider(s) deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error("Error deleting service providers:", error);
    res.status(500).json({
      success: false,
      message: "Service providers delete mein masla aya hai."
    });
  }
};

export { registerAdmin, loginAdmin , logoutAdmin, getAllServiceProviders, deleteServiceProviders };