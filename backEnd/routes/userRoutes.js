
import express from "express";
import { checkAuth, login, register, updateProfile } from "../controllers/userController.js";
import { protectRoute } from "../middlewares/auth.js";
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.put("/update-profile", protectRoute, updateProfile);
userRouter.get("/check-auth",protectRoute,checkAuth);

export default userRouter;