import { Room } from "../models/room.models";
import { User } from "../models/user.models";
import { createRoomType } from "../types/property/room.types";
import { clearCache, getVal, setValKey } from "../utils/redis.utils";
import { createPropertyService } from "./property.services";

export const getRoomDataService = async (firebaseUid: string) => {

    const user = await User.exists({ firebaseUid })

    if (!user) {
        throw new Error("Unauthorized")
    }

    const cacheKey = "room:all";

    const cached = await getVal(cacheKey);

    if (cached !== null) {
        return {
            data: JSON.parse(cached),
            source: "redis",
        };
    }



    const data = await Room.find()
        .sort({
            "pricing.monthlyRent": 1,
        })
        .lean();

    await setValKey(
        cacheKey,
        JSON.stringify(data)
    );

    return {
        data,
        source: "db",
    };

}

export const createRoomService = async (firebaseUid: string, payload: createRoomType) => {
    const user = await User.findOne({ firebaseUid }).select("role").lean()

    if (!user || user.role === "Tenant") {
        throw new Error("Unauthorized")
    }

    const property = await createPropertyService(firebaseUid, payload.createPropertySchema)

    if (!property) {
        throw new Error("Failed to create property")
    }

    const room = await Room.create({
        propertyId:property._id,
        roomDetails:{
            roomType:payload.roomType,
            capacity:payload.capacity,
            bedType:payload.bedType,
            area:payload.area
        },
        pricing:{
            monthlyRent:payload.monthlyRent,
            securityDeposit:payload.securityDeposit,
            maintenanceCharges:payload.maintenanceCharges,
        },
        amenities:property.amenities,
        availability:{
            startDate:payload.startDate,
            endDate:payload.endDate,
            currentOccupants:payload.currentOccupants,
        },
        photos:property.photos
    })
    
    const cacheKey = "room:all";
    
    await clearCache(cacheKey)
    
    return room

}