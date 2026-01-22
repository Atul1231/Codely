import mongoose from 'mongoose'

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true // Now strictly required
    },
    profileImage: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userschema);

export default User;