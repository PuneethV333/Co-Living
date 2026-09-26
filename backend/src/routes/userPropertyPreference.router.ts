import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { createUserPropertyPreference, getRoomMatePreference, getUserPropertyPreference, updateUserPropertyPreference } from "../controllers/userPropertyPreference.controller";

export const userPropertyPreferenceRouter = Router()

userPropertyPreferenceRouter.get("/get", authMiddleWare, getUserPropertyPreference)
userPropertyPreferenceRouter.get("/roomMate/match", authMiddleWare, getRoomMatePreference)
userPropertyPreferenceRouter.post("/create", authMiddleWare, createUserPropertyPreference)
userPropertyPreferenceRouter.post("/update", authMiddleWare, updateUserPropertyPreference)
