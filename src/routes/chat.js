import express from "express";
import Chat from "../models/chat.js";
import { userAuth } from "../middlewares/auth.js";

const chatRouter = express.Router();


chatRouter.get("/chat/:targetUserId", userAuth, async(req,res) => {
    const {targetUserId} = req.params;
    const userId = req.user._id;
    try{
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
              path:"messages.senderId",
              select: "firstName lastName"
        })
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    console.error(err);
  }
})


export default chatRouter;