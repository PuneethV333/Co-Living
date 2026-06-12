import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { auth, completeOnBoarding, getMe, sendOtp, sendOtpViaEmail, verifyOtp, verifyOtpViaEmail } from "../controllers/auth.controller";

export const authRouter = Router();

authRouter.post("/", authMiddleWare, auth);
authRouter.get("/me", authMiddleWare, getMe);
authRouter.post("/sendOtp", authMiddleWare, sendOtp);
authRouter.post("/verifyOtp", authMiddleWare, verifyOtp);
authRouter.post("/email/sendOtp", authMiddleWare, sendOtpViaEmail);
authRouter.post("/email/verifyOtp", authMiddleWare, verifyOtpViaEmail);
authRouter.post("/on-boarding", authMiddleWare, completeOnBoarding);
