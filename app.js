import express from "express";
import bodyParser from 'express'
import dotenv from "dotenv";
import cors from "cors";

dotenv.config()

const app = express();

app.use(bodyParser.json())

app.use(cors({
  origin:true,
  methods:[ "GET","POST","PUT","PATCH","DELETE"],
  credentials:true
}))

// home testing route
app.get('/',(req,res)=>res.json({messge:'This is home route'}))

app.listen(3000, () => {
    console.log("Server is listning on Port ");
    
})