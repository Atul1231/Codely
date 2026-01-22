import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { upsertStreamUser,deleteStreamUser } from '../lib/stream.js'; 

export const register = async (req, res) => {
    try {
        const { name, email, password, profileImage } = req.body;

        // 1. Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create User in MongoDB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImage: profileImage || ""
        });

        // 4. SYNC WITH STREAM (Added)
        // We use the MongoDB _id as the unique identifier for Stream
        await upsertStreamUser({
            id: user._id.toString(),
            name: user.name,
            image: user.profileImage,
        });

        // 5. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error during registration" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' } 
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
};

// 6. DELETE USER (Added)
// This handles both the DB removal and Stream cleanup in one go
export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id; // Attached by your new protectRoute

        // Delete from MongoDB
        await User.findByIdAndDelete(userId);

        // Delete from Stream
        // Ensure you have deleteStreamUser exported from your lib/stream.js
        await deleteStreamUser(userId.toString());

        res.status(200).json({ message: "Account and Stream data deleted successfully" });
    } catch (error) {
        console.error("Delete Account Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getMe = async (req, res) => {
    try {
        // req.user is already populated by your protectRoute middleware
        res.status(200).json({
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                profileImage: req.user.profileImage
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};