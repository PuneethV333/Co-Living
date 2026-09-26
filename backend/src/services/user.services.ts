import { Property } from "../models/property.models"
import { User } from "../models/user.models"
import { userUpdateType } from "../types/user/user.types"
import { clearCache, getVal, setValKey } from "../utils/redis.utils"

export const updateUserDataService = async (firebaseUid: string, payload: userUpdateType) => {
    const update: Record<string, unknown> = {
        name: payload.name,
    };

    if (payload.email) update.email = payload.email;
    if (payload.phoneNumber) update.phoneNumber = payload.phoneNumber;
    if (payload.bio) update.bio = payload.bio;
    if (payload.profilePic) update.profilePic = payload.profilePic;

    const unset: Record<string, 1> = {};
    if (!payload.email) unset.email = 1;
    if (!payload.phoneNumber) unset.phoneNumber = 1;
    if (!payload.bio) unset.bio = 1;

    const user = await User.findOneAndUpdate(
        {
            firebaseUid
        },
        {
            ...update,
            ...(Object.keys(unset).length > 0 && { $unset: unset }),
        },
        { returnDocument: "after" }
    )

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
    if (cached !== null) {
        return { data: JSON.parse(cached), source: "redis" }
    }

    const data = await User.findOne({ firebaseUid }).select("saved").populate({
        path: "saved",
        populate: {
            path: "ownerId",
        },
    }).lean()
    const savedProperties = data?.saved ?? [];
    await setValKey(cacheKey, JSON.stringify(savedProperties))
    return { data: savedProperties, source: "db" }
}


export const toggleSavePropertyService = async (
    firebaseUid: string,
    propertyId: string
) => {
    const [user, propertyExists] = await Promise.all([
        User.findOne({ firebaseUid })
            .select("saved")
            .lean(),
        Property.exists({ _id: propertyId }),
    ]);

    if (!user) {
        throw new Error("User not found");
    }

    if (!propertyExists) {
        throw new Error("Property not found");
    }

    const savedProperties = user.saved ?? [];

    const isSaved = savedProperties.some(
        (id) => id.toString() === propertyId
    );

    const updatedUser = await User.findOneAndUpdate(
        { firebaseUid },
        isSaved
            ? { $pull: { saved: propertyId } }
            : { $addToSet: { saved: propertyId } },
        {
            new: true,
        }
    )
        .select("saved")
        .populate({
            path: "saved",
            populate: {
                path: "ownerId",
            },
        })
        .lean();

    await clearCache(`saved:${firebaseUid}`);

    return {
        saved: !isSaved,
        data: updatedUser?.saved ?? [],
    };
};