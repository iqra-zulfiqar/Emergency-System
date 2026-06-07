// Controllers/adminControllers.js

import { User } from "../Models/user.js";

// 1. Pending Users Fetch karein (Sidebar: User Request)
const getPendingRequests = async (req, res) => {
  try {
    const requests = await User.find({ status: "pending" });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Requests fetch nahi ho sakin!" });
  }
};

// 2. Approved Users Fetch karein (Sidebar: Approved User)
const getApprovedUsers = async (req, res) => {
  try {
    const approved = await User.find({ status: "approved" });
    res.status(200).json(approved);
  } catch (error) {
    res.status(500).json({ message: "Users fetch nahi ho sakay!" });
  }
};

// 3. User Status Update (Approve ya Reject karne ke liye)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Front-end se 'approved' ya 'rejected' aaye ga

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status: status },
      { returnDocument: 'after', runValidators: true}
    );

    res.status(200).json({ message: `User ${status} ho gaya hai!`, updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Status update fail ho gaya!" });
  }
};

export { getPendingRequests, getApprovedUsers, updateUserStatus };