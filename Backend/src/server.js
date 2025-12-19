import express from "express";
import { ENV } from "./lib/env.js";
const app = express();
app.get("/",(req,res) => {
    res.status(200).json({msg:"success from the backend"})
});
app.get("/books",(req,res) => {
    res.status(200).json({msg:"success from the backend of books"})
});

app.listen(ENV.PORT,()=>{
    console.log("server running",ENV.PORT)
})
