import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { updateUserData } from "../controllers/user.contoller";

export const userRouter = Router()

userRouter.post("/update",authMiddleWare,updateUserData)