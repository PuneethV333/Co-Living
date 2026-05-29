import { NextFunction, Request, Response } from "express";
import { getError } from "../utils/error.utils";
import admin from "../config/firebase.config";
import { User } from "../models/user.models";

export const authMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized: No token provided",
    });
  }

  const token = authHeader.slice(7);

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({
      firebaseUid: decodedToken.uid,
    });


    req.user = {
      firebaseUid: decodedToken.uid,
      role: user?.role,
    };

    next();
  } catch (err) {
    console.error("Firebase Token Verification Error:", err);

    return res.status(401).json(getError(err));
  }
};