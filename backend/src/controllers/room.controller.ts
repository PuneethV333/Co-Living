import { Request, Response } from "express"
import { getError } from "../utils/error.utils"
import { createRoomService, getRoomDataService } from "../services/room.services"
import { createRoomSchema } from "../types/property/room.types"

export const getRoomData = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid

        if (!firebaseUid) {
            return res.status(400).json({
                message: "unauthorized"
            })
        }

        const result = await getRoomDataService(firebaseUid)

        return res.status(200).json({
            data: result.data,
            source: result.source
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}

export const createRoom = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const parsed = createRoomSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "Schema miss Match"
            })
        }

        const result = await createRoomService(firebaseUid, parsed.data)

        return res.status(200).json({
            data: result
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
}