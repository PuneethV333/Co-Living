import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { userUpdateSchema } from "../types/user/user.types";
import { getSavedPropertyDataService, toggleSavePropertyService, updateUserDataService } from "../services/user.services";

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

export const getSavedPropertyData = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;
        if (!firebaseUid) {
            return res.status(401).json({
                message: "unauthorized"
            })
        }

        const result = await getSavedPropertyDataService(firebaseUid)

        return res.status(200).json({
            data: result.data,
            source: result.source
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}

export const toggleSaveProperty = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const propertyId = req.params.id

        if (!propertyId) {
            return res.status(401).json({
                message: "property Id not provided"
            })
        }

        const result = await toggleSavePropertyService(firebaseUid, Array.isArray(propertyId) ? propertyId[0] : propertyId)

        return res.status(200).json({
            data: result.data,
            saved: result.saved
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}