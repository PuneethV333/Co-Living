import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { handleAuth } from "../services/auth.services";
import { authResType } from "../types/user/auth.types";

export const auth = async (req: Request, res: Response) => {
  try {
    const firebaseUid = req.user?.firebaseUid;

    if (!firebaseUid) {
      return res.status(401).json({
        message: "firebaseUid not found",
      });
    }

    const { user, isNewUser } = await handleAuth(firebaseUid);

    const data: authResType = {
      firebaseUid: user.firebaseUid,
      _id: user._id.toString(),
      completeOnBoarding: user.completeOnBoarding,
    };

    return res.status(isNewUser ? 201 : 200).json({
      data: data,
      message: isNewUser ? "User created" : "User exists",
    });
  } catch (err) {
    res.status(500).json(getError(err));
  }
};
