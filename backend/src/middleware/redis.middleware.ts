import { NextFunction, Request, Response } from "express";

export const redisMiddleWare = (_:Request,res:Response,next:NextFunction) => {
    res.set("Cache-Control","no-store");
    next()
}