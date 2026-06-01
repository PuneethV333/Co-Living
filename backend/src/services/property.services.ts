import { Property } from "../models/property.models"
import { User } from "../models/user.models"
import { getVal, setValKey } from "../utils/redis.utils"

export const getPropertyDataService = async (
    firebaseUid: string
) => {
    const cacheKey = "properties:active";

    const cached = await getVal(cacheKey);

    if (cached) {
        return {
            data: JSON.parse(cached),
            source: "redis",
        };
    }

    const user = await User.findOne({
        firebaseUid,
    }).lean();

    if (!user) {
        throw new Error("unauthorized");
    }

    const data = await Property.find({
        isActive: true,
    })
        .populate("ownerId", "name phone verified")
        .lean();

    await setValKey(
        cacheKey,
        JSON.stringify(data)
    );

    return {
        data,
        source: "db",
    };
};


export const getPropertyDetailService = async (firebaseUid:string,propertyId:string) => {
    const cacheKey = `property:${propertyId}:${firebaseUid}`
    const cached = await getVal(cacheKey);
    if(cached){
        return {data:JSON.parse(cached),source:"redis"}
    }
    
    const user = await User.findOne({firebaseUid}).lean()
    
    if(!user){
        throw new Error("Unauthorized")
    }
    
    const data = await Property.findOne({_id:propertyId}).populate("ownerId","name phoneNumber verified").lean()
    
    await setValKey(cacheKey,JSON.stringify(data))
    return {data,source:"db"}
}