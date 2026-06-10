import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { getSavedPropertyData, toggleSaveProperty, updateUserData } from "../controllers/user.controller";

export const userRouter = Router()

userRouter.post("/update", authMiddleWare, updateUserData)
userRouter.get("/saved/property", authMiddleWare, getSavedPropertyData)
userRouter.post("/save/:id", authMiddleWare, toggleSaveProperty)    