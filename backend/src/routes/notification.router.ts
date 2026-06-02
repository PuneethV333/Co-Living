import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { createNotification, getAllNotification, getNotification } from "../controllers/notification.controller";

export const notificationRouter = Router()

notificationRouter.post("/create", authMiddleWare, createNotification)
notificationRouter.get("/get/new", authMiddleWare, getNotification)
notificationRouter.get("/get/all", authMiddleWare, getAllNotification)