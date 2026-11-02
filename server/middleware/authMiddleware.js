
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    // Read the authentication cookie
    const token = req.cookies?.documind_token;

    if (!token) {
      return res.status(401).json({
        error: "Authentication required. Please log in.",
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Verify that the user still exists
    const user = await User.findById(decoded.userId).select(
      "_id name email"
    );

    if (!user) {
      return res.status(401).json({
        error: "User account not found. Please log in again.",
      });
    }

    // Attach authenticated user to the request
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error.message);

    return res.status(401).json({
      error: "Invalid or expired session. Please log in again.",
    });
  }
};

export default authMiddleware;
