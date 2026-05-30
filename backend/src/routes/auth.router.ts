import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { auth, completeOnBoarding, getMe } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/", authMiddleWare, auth);
authRouter.get("/me", authMiddleWare, getMe);
authRouter.post("/on-boarding", authMiddleWare, completeOnBoarding);
