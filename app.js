import express from "express";
import bodyParser from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./src/config/database.js";
import cookieParser from "cookie-parser";
import authRouter from "./src/routes/auth.js";
import profileRouter from "./src/routes/profile.js";
import requestRouter from "./src/routes/request.js";
import userRouter from "./src/routes/user.js";
import startCronJob from "./src/utils/cronjob.js";
import paymentRouter from "./src/routes/payment.js";
import http from "http";
import initializeSocket from "./src/utils/socket.js";
import chatRouter from "./src/routes/chat.js";

dotenv.config();

startCronJob();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",  // Allow frontend's origin
    // methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"], // Allow methods including PATCH
    credentials: true,  // Allow credentials (cookies) to be sent with the request
  })
);

app.use(express.json());
app.use(cookieParser());
// home testing route
//app.get("/", (req, res) => res.json({ messge: "This is home route" }));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/" , chatRouter)

const port = 3000;

const server = http.createServer(app);

initializeSocket(server)

connectDb()
  .then(() => {
    console.log("MongoDB Connected Succesfully");
    server.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => console.log(err));
