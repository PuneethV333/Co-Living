import { Request, Response } from "express"
import { getError } from "../utils/error.utils"
import { createPropertyService, getMyPropertiesService, getPropertyDataService, getPropertyDetailService, searchPropertyService } from "../services/property.services"
import { createPropertySchema, searchSchema } from "../types/property/property.types"
import z from "zod"

export const getPropertyData = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid

        if (!firebaseUid) {
            return res.status(400).json({
                message: "unauthorized"
            })
        }

        const result = await getPropertyDataService(firebaseUid)

        return res.status(200).json({
            data: result.data,
            source: result.source
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}

export const getPropertyDetails = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid

        if (!firebaseUid) {
            return res.status(400).json({
                message: "unauthorized"
            })
        }

        const propertyId = req.params.id
        if (!propertyId) {
            return res.status(400).json({
                message: "Data not provided"
            })
        }

        const result = await getPropertyDetailService(firebaseUid, Array.isArray(propertyId) ? propertyId[0] : propertyId)

        return res.status(200).json({
            data: result.data,
            source: result.source
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}

export const createProperty = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const parsed = createPropertySchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "Schema does'nt match",
                error: parsed.error.message
            })
        }

        const result = await createPropertyService(firebaseUid, parsed.data)

        return res.status(200).json({
            message: "Create New Property",
            data: result
        })

    } catch (err) {
        return res.status(500).json(getError(err))
    }
}

export const searchProperty = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const parsed = searchSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Schema mismatch",
                errors: z.treeifyError(parsed.error),

            });
        }

        const result = await searchPropertyService(
            firebaseUid,
            parsed.data.query
        );

        return res.status(200).json({
            data: result
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}

export const getMyProperties = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid
        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }


        const result = await getMyPropertiesService(firebaseUid)

        return res.status(200).json({
            data: result.data,
            source: result.source
        })

    } catch (err) {
        res.status(500).json(getError(err))
    }
}