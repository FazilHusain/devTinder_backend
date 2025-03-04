import express from "express";
import bodyParser from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./src/config/database.js";
import cookieParser from "cookie-parser";
import { validateSignUpData } from "./src/utils/validation.js";
import bcrypt from "bcryptjs";
import User from "./src/models/user.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
// home testing route
app.get("/", (req, res) => res.json({ messge: "This is home route" }));

app.post("/signup", async (req, res) => {
  try {
    //validation of the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //encrypting password
    const passwordHash = await bcrypt.hash(password, 10);

    //create a new instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    const savedUser = await user.save();

    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
  } catch (error) {
    res.status(400).send("ERROR : " + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + err.message);
  }
});

const port = 3000;

connectDb()
  .then(() => {
    console.log("MongoDB Connected Succesfully");
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => console.log(err));
