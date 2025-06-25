
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messagesRoutes.js";
import { Server } from "socket.io";


//Create Express App and HTTP server
const app = express();
const server = http.createServer(app);  //using http server because SocketIO need that (socketIO need HTTP SETVER for INIT)

//config for dotenv
dotenv.config();

//Initialize socket.io server
export const io = new Server(server, {
    cors: { origin: "*" }
})

//store online users (store data of all online users)
export const userSocketMap = {}; // { userId:socketId }

//socket.io connection handler 
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;  //this is query that socket receive from frontend side and userId here is a field we send in query 
    console.log("User Connected", userId);

    if (userId) userSocketMap[userId] = socket.id; //set socketId for all users that request connection

    //Emit online users to all connection clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //disconnect user from socket
    socket.on("disconnect", () => {
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); //send again the list of all online users to frontend(clients/people online right now) to update the online users 

    })
})

//Middleware setup
app.use(express.json({ limit: "4mb" })); //set files until 4MB
app.use(cors());

//Routes setup
app.get("/", (req, res) => {
    res.send("Server Is Live")
});

app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

//Connect To DB
await connectDB();


if(process.env.NODE_ENV!=='production'){
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => console.log(`Server Is Running On: http://localhost:${PORT}`));
}

export default server;
