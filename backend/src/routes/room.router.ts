import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { getRoomData } from "../controllers/room.controller";

export const roomRouter = Router()

roomRouter.get("/get",authMiddleWare,getRoomData)