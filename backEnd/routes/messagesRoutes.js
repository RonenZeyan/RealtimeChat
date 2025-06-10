
import express from "express";
import { protectRoute } from "../middlewares/auth.js";
import { getAllUsers, getMessages, markMessageAsSeen, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users",protectRoute,getAllUsers);
messageRouter.get("/get-messages/:id",protectRoute,getMessages);
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send-message/:id",protectRoute,sendMessage);


export default messageRouter;