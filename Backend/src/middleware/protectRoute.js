import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(), // Clerk validates session
  async (req, res, next) => {
    try {
      if (!req.auth?.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const clerkId = req.auth.userId;
      const user = await User.findOne({ clerkId });

      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;
      next();
    } catch (err) {
      console.error("ProtectRoute error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
