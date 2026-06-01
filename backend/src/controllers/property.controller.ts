import { Request, Response } from "express"
import { getError } from "../utils/error.utils"
import { getPropertyDataService, getPropertyDetailService } from "../services/property.services"

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
        if(!propertyId){
            return res.status(400).json({
                message: "Data not provided"
            })
        }

        const result = await getPropertyDetailService(firebaseUid,Array.isArray(propertyId)?propertyId[0]:propertyId)

        return res.status(200).json({
            data: result.data,
            source: result.source
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}
