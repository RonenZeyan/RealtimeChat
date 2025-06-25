import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {


    //useState Hooks
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});


    //useContext Hooks
    const { socket, axios } = useContext(AuthContext);

    //functions

    //function to get all users for sidebar
    const getUsers = async () => {
        try {
            const { data } = await axios.get("/api/messages/users");
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMsgs);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to get messages for selected user (iam as client choose user in my list to see/chat with him specific)
    const getMessages = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/get-messages/${userId}`);
            console.log(data)
            if (data.success) {
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to send message to selectedUser
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send-message/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages(prev => [...prev, data.newMessage]) //push new message to messages state
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //function to subscribe to messages for selectedUser
    const subscribeToMessages = async () => {
        if (!socket) {
            return;
        }
        socket.on("newMessage", (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                newMessage.seen = true;
                setMessages(prev => [...prev, newMessage]) //push new message to messages state
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else {
                setUnseenMessages(prev => ({ ...prev, [newMessage.senderId]: prev[newMessage.senderId] ? prev[newMessage.senderId] + 1 : 1 }))
            }
        })
    }

    //function to unsubscribe from messages 
    const unsubscribeFromMessages = () => {
        if (socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        setUnseenMessages,
        unseenMessages,
    }

    return (
        <ChatContext value={value}>
            {children}
        </ChatContext>
    )
}

