import { config } from "../config/data.config";
import { qdrantClient } from "../config/qdrant.config";
import { nameSpace } from "../constants/nameSpace";
import { User } from "../models/user.models";
import { PropertyPreference } from "../models/userPropertyPreference.models";
import { createUserPropertyPreferencePayloadType } from "../types/property/userPropertyPreference.types";
import { getVal, setValKey } from "../utils/redis.utils";
import { getEmbeddingServices } from "./ai.services";
import { v5 as uuidv5 } from "uuid";



export const createUserPropertyPreferenceService = async (
    firebaseUid: string,
    payload: createUserPropertyPreferencePayloadType
) => {
    const user = await User.exists({ firebaseUid });

    if (!user) {
        throw new Error("Unauthorized");
    }

    const existing = await PropertyPreference.exists({
        userId: user._id,
    });

    if (existing) {
        throw new Error("Preference already exists");
    }
    const pref = await PropertyPreference.create({
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
        },
    });

    const roommateProfile = `
Gender: ${pref.genderPreference}
Work mode: ${pref.workMode}
Food preference: ${pref.foodPreference}
Occupancy preference: ${pref.occupancyPreference}
Private room: ${pref.roomPreference.privateRoom}
Shared room: ${pref.roomPreference.sharedRoom}
Pet friendly: ${pref.petFriendly}
Preferred locations: ${pref.preferredLocations.join(", ")}
`;

    const embedding = await getEmbeddingServices(roommateProfile);

    const pointId = uuidv5(user._id.toString(), nameSpace);

    await qdrantClient.upsert("roomMate", {
        points: [
            {
                id: pointId,
                vector: embedding,
                payload: {
                    userId: user._id.toString(),
                    profileId: pref._id.toString(),
                    budget: pref.budget,
                    gender: pref.genderPreference,
                    occupancy: pref.occupancyPreference,
                    location: pref.preferredLocations,
                    propertyTypes: pref.propertyTypes,
                },
            },
        ],
    });

    const cacheKey = `PropertyPreference:${firebaseUid}`
    await setValKey(cacheKey, JSON.stringify(pref));

    return pref;
};

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

    const pref = await PropertyPreference.findOneAndUpdate({ userId: user._id }, {
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

    if (!pref) {
        throw new Error("Failed to updated Preferences")
    }

    const roommateProfile = `
Gender: ${pref.genderPreference}
Work mode: ${pref.workMode}
Food preference: ${pref.foodPreference}
Occupancy preference: ${pref.occupancyPreference}
Private room: ${pref.roomPreference.privateRoom}
Shared room: ${pref.roomPreference.sharedRoom}
Pet friendly: ${pref.petFriendly}
Preferred locations: ${pref.preferredLocations.join(", ")}
`;

    const embedding = await getEmbeddingServices(roommateProfile);

    const pointId = uuidv5(user._id.toString(), nameSpace);

    await qdrantClient.upsert("roomMate", {
        points: [
            {
                id: pointId,
                vector: embedding,
                payload: {
                    userId: user._id.toString(),
                    profileId: pref._id.toString(),
                    budget: pref.budget,
                    gender: pref.genderPreference,
                    occupancy: pref.occupancyPreference,
                    location: pref.preferredLocations,
                    propertyTypes: pref.propertyTypes
                },
            }
        ]
    });

    const cacheKey = `PropertyPreference:${firebaseUid}`;
    await setValKey(cacheKey, JSON.stringify(pref));

    return pref;
}

export const getRoomMatePreferenceService = async (firebaseUid: string) => {
    const user = await User.exists({ firebaseUid });

    if (!user) {
        throw new Error("Unauthorized")
    }

    const pointId = uuidv5(user._id.toString(), nameSpace);

    const points = await qdrantClient.retrieve(
        "roomMate",
        {
            ids: [pointId],
            with_vector: true,
            with_payload: true,
        }
    );

    const currentUserPoint = points[0];

    if (!currentUserPoint) {
        throw new Error(
            "User preference embedding not found"
        );
    }


    const matches = await qdrantClient.query(
        "roomMate",
        {
            query: currentUserPoint.vector as number[],
            limit: 20,
            with_payload: true,
            filter: {
                must_not: [
                    {
                        key: "userId",
                        match: {
                            value: user._id.toString(),
                        },
                    },
                ],
            },
        }
    );

    const userIds = matches.points.map(
        (point) => point.payload?.userId as string
    );

    const users = await User.find({
        _id: { $in: userIds },
    }).lean();

    const scoreMap = new Map(
        matches.points.map((point) => [
            point.payload?.userId,
            point.score,
        ])
    );

    return users.map((u) => ({
        ...u,
        matchScore: scoreMap.get(u._id.toString()),
    }));
}