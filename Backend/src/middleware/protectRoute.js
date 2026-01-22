import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {ENV} from "../lib/env.js";
export const protectRoute = async (req, res, next) => {
  try {
    // 1. Grab the token from the Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // 2. Verify the token using your secret key
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // 3. Find the user by the ID stored in the token payload
    // We use .select("-password") to ensure the hashed password isn't passed around
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    // 4. Attach the user object to the request for use in controllers
    req.user = user;
    
    next();
  } catch (err) {
    console.error("ProtectRoute error:", err.message);
    
    // Handle specific JWT errors
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    
    res.status(401).json({ message: "Invalid token" });
  }
};