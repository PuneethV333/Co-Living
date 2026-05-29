import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { auth, getMe } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/", authMiddleWare, auth);
authRouter.get("/me", authMiddleWare, getMe);
