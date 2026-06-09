import { User } from "../models/user.models"
import { userUpdateType } from "../types/user/user.types"
import { getVal, setValKey } from "../utils/redis.utils"

export const updateUserDataService = async (firebaseUid: string, payload: userUpdateType) => {
    const user = await User.findOneAndUpdate({
        firebaseUid
    }, {
        name: payload.name,
        bio: payload.bio,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        profilePic: payload.profilePic
    }, { returnDocument: "after" })

    if (!user) {
        throw new Error("Failed to update user")
    }

    await Promise.all([
        user.populate("tenantProfile"),
        user.populate("ownerProfile")
    ])

    const cacheKey = `user:${firebaseUid}`;
    await setValKey(cacheKey, JSON.stringify(user), 3600)

    return user
}

export const getSavedPropertyDataService = async (firebaseUid: string) => {
    const cacheKey = `saved:${firebaseUid}`
    const cached = await getVal(cacheKey)
    if (cached) {
        return { data: JSON.parse(cached), source: "redis" }
    }

    const data = await User.findOne({ firebaseUid }).select("saved").populate("saved").lean()
    const savedProperties = data?.saved ?? [];
    await setValKey(cacheKey, JSON.stringify(savedProperties))
    return { data:savedProperties, source: "db" }
}