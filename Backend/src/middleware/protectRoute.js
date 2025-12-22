import { requireAuth } from "@clerk/express";
import User from "../models/User.js";

export const protectRoute = [
    requireAuth(),
    async (req,res ,next) =>{
        try {
            const clerkId = req.auth().userId;
            if (!clerkId) return res.status(401).json({message:"unauthorized - invalid token"});
            // find user by clerk id
            const user = await User.findOne({clerkId});
            if (!user) return res.status(401).json({message:"user not found"});
            res.user = user;
            next();
        } catch (error) {
            console.error("Error in protectRoute middleware",error);
            res.status(500).json({message:"internal server error"});
        }
    }
]