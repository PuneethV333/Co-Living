import { NextFunction, Request, Response } from "express";

export const errorHandling = (
  err: Error & {status?:number},
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "internal server error",
  });
};
