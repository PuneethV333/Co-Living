import { User } from "../models/user.models";
import { PropertyPreference } from "../models/userPropertyPreference.models";
import { createUserPropertyPreferencePayloadType } from "../types/property/userPropertyPreference.types";
import { getVal, setValKey } from "../utils/redis.utils";

export const createUserPropertyPreferenceService = async (firebaseUid: string, payload: createUserPropertyPreferencePayloadType) => {
    const user = await User.exists({ firebaseUid });

    if (!user) {
        throw new Error("Unauthorized")
    }

    const newUserPropertyPreference = PropertyPreference.create({
        userId: user._id,
        budget: {
            max: payload.max,
            min: payload.min,
        },
        preferredLocations: payload.preferredLocations,
        propertyTypes: payload.propertyTypes,
        amenities: payload.amenities,
        roomPreference: {
            privateRoom: payload.privateRoom,
            sharedRoom: payload.sharedRoom,
        },
        genderPreference: payload.genderPreference,
        occupancyPreference: payload.occupancyPreference,
        workMode: payload.workMode,
        foodPreference: payload.foodPreference,
        petFriendly: payload.petFriendly,
        transportNeeds: {
            metroNearby: payload.metroNearby,
            parkingRequired: payload.parkingRequired,
        }
    })

    return newUserPropertyPreference;
}

export const getUserPropertyPreferenceService = async (firebaseUid: string) => {
    const user = await User.exists({ firebaseUid });

    if (!user) {
        throw new Error("Unauthorized")
    }

    const cacheKey = `PropertyPreference:${firebaseUid}`

    const cached = await getVal(cacheKey);

    if (cached) {
        return { data: JSON.parse(cached), source: "redis" }
    }

    const data = await PropertyPreference.findOne({ userId: user?._id }).lean()

    await setValKey(cacheKey, JSON.stringify(data))

    return { data, source: "db" }
}

export const updateUserPropertyPreferenceService = async (firebaseUid: string, payload: createUserPropertyPreferencePayloadType) => {
    const user = await User.exists({ firebaseUid });

    if (!user) {
        throw new Error("Unauthorized")
    }

    const updatedUserPropertyPreference = PropertyPreference.findOneAndUpdate({ userId: user._id }, {
        userId: user._id,
        budget: {
            max: payload.max,
            min: payload.min,
        },
        preferredLocations: payload.preferredLocations,
        propertyTypes: payload.propertyTypes,
        amenities: payload.amenities,
        roomPreference: {
            privateRoom: payload.privateRoom,
            sharedRoom: payload.sharedRoom,
        },
        genderPreference: payload.genderPreference,
        occupancyPreference: payload.occupancyPreference,
        workMode: payload.workMode,
        foodPreference: payload.foodPreference,
        petFriendly: payload.petFriendly,
        transportNeeds: {
            metroNearby: payload.metroNearby,
            parkingRequired: payload.parkingRequired,
        }
    }, { returnDocument: "after" })
    
    if(!updatedUserPropertyPreference){
        throw new Error("Failed to updated Preferences")
    }

    const cacheKey = `PropertyPreference:${firebaseUid}`

    await setValKey(cacheKey, JSON.stringify(updatedUserPropertyPreference))

    return updatedUserPropertyPreference;
}