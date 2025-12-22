import { chatClient } from "../lib/stream.js";

export async function getStreamToken(req,res) {
    try {
        // use clerkId to access the user in stream not from the mongoDB
        const token = chatClient.createToken(req.user.clerkId)

        res.status(200).json({
            token,
            userId:req.user.clerkId,
            userName:req.user.name,
            userImage:req.user.image
        })
    } catch (error) {
        console.error("Error in getStreamToken",error);
        res.status(500).json({message:"internal server error"});
    }
}