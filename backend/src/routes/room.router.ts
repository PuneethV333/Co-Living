import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { createRoom, getRoomData } from "../controllers/room.controller";

export const roomRouter = Router()

roomRouter.get("/get", authMiddleWare, getRoomData)
roomRouter.post("/create", authMiddleWare, createRoom)