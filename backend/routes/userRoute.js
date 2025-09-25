import express from "express";
import {
  getCurrentUser,
  loginUser,
  registerUser,
  updatePassword,
  updateProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();
//Public Links

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

//private links

userRouter.get("/me", authMiddleware, getCurrentUser);
userRouter.put("/profile", updateProfile);
userRouter.put("/password", updatePassword);

export default userRouter;
