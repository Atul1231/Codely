import express from "express";
import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import {serve} from "inngest/express"
import { inngest ,functions} from "./lib/inngest.js";
import {clerkMiddleware} from '@clerk/express'
import chatRoutes from "./routes/chatRoutes.js"
import sessionRoutes from "./routes/sessionRoutes.js"
const app = express();

app.use(express.json())
// credential = true means the server allows the browser to include cookies on request
app.use(cors({
  origin: [
    ENV.CLIENT_URL
  ],
  credentials: true
}));
app.use(clerkMiddleware())   // this adds auth field to  request object req.auth()
app.use("/api/inngest" , serve({client:inngest , functions}))
// console.log("Signing key exists:", !!process.env.INNGEST_SIGNING_KEY);
app.use("/api/chat",chatRoutes)
app.use("/api/sessions",sessionRoutes)

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