import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { auth } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/", authMiddleWare, auth);
