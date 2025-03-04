import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongodbUrl = process.env.MONGODB_URI;

export const connectDb = () => {
    return mongoose.connect(mongodbUrl);
 }

 
