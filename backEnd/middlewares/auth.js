import jwt from "jsonwebtoken";
import User from "../models/User.js";

//middleware to protect routes
export const protectRoute = async (req, res, next) => {
    try {
        const authToken = req.headers.authorization;
        if (authToken) {
            const token = authToken.split(" ")[1];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const user = await User.findById(decodedToken.userId).select("-password");
            if (!user) return res.status(401).json({ success: false, message: "user not found" });
            req.user = user;
            next();
        } else {
            return res.status(401).json({ message: "no token provided, access denied" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });

    }
}
