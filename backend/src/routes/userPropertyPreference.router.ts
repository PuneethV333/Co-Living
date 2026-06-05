import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { createUserPropertyPreference, getUserPropertyPreference, updateUserPropertyPreference } from "../controllers/userPropertyPreference.controller";

export const userPropertyPreferenceRouter = Router()

userPropertyPreferenceRouter.get("/get", authMiddleWare, getUserPropertyPreference)
userPropertyPreferenceRouter.post("/create", authMiddleWare, createUserPropertyPreference)
userPropertyPreferenceRouter.post("/update", authMiddleWare, updateUserPropertyPreference)
