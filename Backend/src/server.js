import express from "express";
import { ENV } from "./lib/env.js";
import path from "path";
const app = express();
const __dirname = path.resolve();
app.get("/home",(req,res) => {
    res.status(200).json({msg:"success from the backend"})
});
app.get("/books",(req,res) => {
    res.status(200).json({msg:"success from the backend of books"})
});

if(ENV.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../Frontend/dist")));

    app.get("/{*any}",(req,res) => {
        res.sendFile(path.join(__dirname,"../Frontend","dist","index.html")); 
    } )
}

app.listen(ENV.PORT,()=>{
    console.log("server running",ENV.PORT)
})
