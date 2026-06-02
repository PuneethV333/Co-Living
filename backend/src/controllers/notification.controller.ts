import { Request, Response } from "express";
import { createNotificationSchema } from "../types/user/notification.types";
import { createNotificationService, getAllNotificationService, getNotificationService } from "../services/notification.services";
import { getError } from "../utils/error.utils";

export const createNotification = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const parsed = createNotificationSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "schema mismatch",
                error: parsed.error.message,
            });
        }

        const result = await createNotificationService(parsed.data);

        return res.status(200).json({
            success: result,
        });
    } catch (err) {
        res.status(500).json(getError(err));
    }
};

export const getNotification = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid

        if (!firebaseUid) {
            return res.status(401).json({
                message: "unauthorized"
            })
        }

        const result = await getNotificationService(firebaseUid)

        return res.status(200).json({
            data: result
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}

export const getAllNotification = async (req:Request,res:Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid
        
        if(!firebaseUid){
            return res.status(401).json({
                message:"unauthorized"
            })
        }

        const result = await getAllNotificationService(firebaseUid)
        
        return res.status(200).json({
            data:result
        })

    } catch (err) {
        res.status(500).json(getError(err))
    }
}