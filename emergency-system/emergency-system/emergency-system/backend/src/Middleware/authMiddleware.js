import jwt from "jsonwebtoken";

const protectUser = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Login required!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can perform this action!",
      });
    }

    if (!decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid session. Please log in again.",
      });
    }

    req.user = { id: String(decoded.id), role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token!",
    });
  }
};

export { protectUser };
