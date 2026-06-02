import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { getPropertyData, getPropertyDetails } from "../controllers/property.controller";

export const propertyRouter = Router()

propertyRouter.get("/get",authMiddleWare,getPropertyData)
propertyRouter.get("/details/:id",authMiddleWare,getPropertyDetails)