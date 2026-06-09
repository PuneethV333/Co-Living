import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { userUpdateSchema } from "../types/user/user.types";
import { updateUserDataService } from "../services/user.services";

export const updateUserData = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const parsed = userUpdateSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "schema miss match",
                err: parsed.error.message
            })
        }

        const result = await updateUserDataService(firebaseUid, parsed.data);

        return res.status(200).json({
            data: result
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}