import { Router } from "express";
import { authMiddleWare } from "../middleware/auth.middleware";
import { createProperty, getPropertyData, getPropertyDetails, searchProperty } from "../controllers/property.controller";

export const propertyRouter = Router()

propertyRouter.get("/get",authMiddleWare,getPropertyData)
propertyRouter.get("/details/:id",authMiddleWare,getPropertyDetails)
propertyRouter.post("/create",authMiddleWare,createProperty)
propertyRouter.post("/search",authMiddleWare,searchProperty)