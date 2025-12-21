import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
const app = express();
app.get("/",(req,res) => {
    res.status(200).json({msg:"success from the backend"})
});
app.get("/books",(req,res) => {
    res.status(200).json({msg:"success from the backend of books"})
});

const ServerConnect = async() =>{
    try{
        await connectDB();
        app.listen(ENV.PORT,()=>console.log("server running",ENV.PORT));
    }
    catch(error){
        console.log("💥error connecting the server")
    }
}

ServerConnect();