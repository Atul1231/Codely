import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import {serve} from "inngest/express"
import { inngest ,functions} from "./lib/inngest.js";
const app = express();
app.get("/",(req,res) => {
    res.status(200).json({msg:"success from the backend"})
});
app.get("/books",(req,res) => {
    res.status(200).json({msg:"success from the backend of books"})
});
app.use(express.json())
// credential = true means the server allows the browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}))

app.use("/api/inngest" , serve({client:inngest , functions}))
// console.log("Signing key exists:", !!process.env.INNGEST_SIGNING_KEY);

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