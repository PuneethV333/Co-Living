import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import { createUserPropertyPreferencePayloadSchema } from "../types/property/userPropertyPreference.types";
import { createUserPropertyPreferenceService, getUserPropertyPreferenceService, updateUserPropertyPreferenceService } from "../services/userPropertyPreference.services";

export const createUserPropertyPreference = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const parsed = createUserPropertyPreferencePayloadSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "Schema miss match"
            })
        }

        const result = await createUserPropertyPreferenceService(firebaseUid, parsed.data);

        return res.status(200).json({
            data: result
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}

export const getUserPropertyPreference = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;
        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const result = await getUserPropertyPreferenceService(firebaseUid);

        return res.status(200).json({
            data: result.data,
            source: result.source
        })
    } catch (err) {
        return res.status(500).json(getError(err))
    }
}

export const updateUserPropertyPreference = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;
        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const parsed = createUserPropertyPreferencePayloadSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(401).json({
                message: "schema missMatch"
            })
        }

        const result = await updateUserPropertyPreferenceService(firebaseUid, parsed.data);

        return res.status(200).json({
            data: result
        })

    } catch (err) {
        res.status(500).json(getError(err))
    }
}