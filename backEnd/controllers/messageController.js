import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../app.js";

/**
 * @description Get All users except the logged in user (users to dispaly in sidebar)
 * @router /api/messages/users
 * @method GET
 * @access public
 */
export const getAllUsers = async (req, res) => {
    try {
        //get all users without the logged in user that request the users 
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password"); //filter the document that ._id equal to userId ($ne mean not equal)

        //count the number of messages not seen
        const unseenMsgs = {}
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });
            if (messages.length > 0) {
                unseenMsgs[user._id] = messages.length;
            }
        });
        await Promise.all(promises); //we wait for all promises to finish (callback function in map all are async witch mean they return promise each one of them then we should wait until they all finish)
        res.status(200).json({ success: true, users: filteredUsers, unseenMsgs })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

/**
 * @description Get All messages for selected User
 * @router /api/messages/get-messages/:id
 * @method GET
 * @access user himself
 */
export const getMessages = async (req, res) => {

    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        //get all messages between the requester and selectedUser
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId },
            ]
        });

        //update messages seen field to true (mean that seen)
        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true });

        res.status(200).json({ success: true, messages });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }

}

/**
 * @description Mark Message as seen
 * @router /api/messages/mark/:id
 * @method PUT
 * @access user himself
 */
export const markMessageAsSeen = async (req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true, });
        res.status(200).json({ success: true });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}


/**
 * @description send message to selected user (I send for someone witch mean iam the sender not receiver)
 * @router /api/messages/send-message/:id
 * @method PUT
 * @access user himself
 */
export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        //emit the new message to the receiver's socket
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) { //check if user is online (if not then we dont need to emit because getAllUsers route will send all users with messages)
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }
        res.status(201).json({ success: true, newMessage });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}