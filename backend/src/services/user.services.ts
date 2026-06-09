import { User } from "../models/user.models"
import { userUpdateType } from "../types/user/user.types"
import { setValKey } from "../utils/redis.utils"

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