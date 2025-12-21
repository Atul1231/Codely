import mongoose from "mongoose"

import {ENV} from "./env.js"

export const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("✅ connected to DB",conn.connection.host);
    }
    catch(error){
        console.log("❌ Not connected to DB",error);
        process.exit(1)
    }
}