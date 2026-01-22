import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        // Now using the MongoDB _id as the unique identifier for Stream
        // We convert it to a string because req.user._id is a Mongoose ObjectId
        const userId = req.user._id.toString();
        
        const token = chatClient.createToken(userId);

        res.status(200).json({
            token,
            userId: userId,
            userName: req.user.name,
            // Changed from .image to .profileImage to match your updated User model
            userImage: req.user.profileImage 
        });
    } catch (error) {
        console.error("Error in getStreamToken", error);
        res.status(500).json({ message: "internal server error" });
    }
}