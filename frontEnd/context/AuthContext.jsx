import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);

    //check if user is authenticated and if so, set the user data and connect the socket 
    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check-auth");
            if (data.success) {
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    //login function to handle user authentication and socket connection (state = "login" || "register")
    const login = async (state, credentials) => {
        try {
            console.log(state, credentials)
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if (data.success) {
                setAuthUser(data.user_data);
                connectSocket(data.user_data);
                axios.defaults.headers.common["authorization"] = `bearer ${data.token}`; //add the token for all axios requests
                setToken(data.token);
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //logout function to handle user logout and socket disconnection
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["authorization"] = null;
        toast.success("logout successfully");
        socket.disconnect(); //disconnect socket

    }

    //update profile function to handle user profile updates
    const updateProfile = async (body) => {
        try {
            const { data } = await axios.put(`/api/auth/update-profile`, body);
            if (data.success) {
                setAuthUser(data.updatedUser);
                toast.success("Profile Updated Successfully")
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //connect socket function to handle socket connection and online user updates
    const connectSocket = (userData) => {
        if (!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id, //in backend we get userId from query 
            }
        });
        newSocket.connect(); //connect for socket 
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        })
    }

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["authorization"] = `bearer ${token}`; //add the token for all axios requests
            checkAuth();
        }
    }, [token]);

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}