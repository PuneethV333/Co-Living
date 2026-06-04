import { Room } from "../models/room.models";
import { User } from "../models/user.models";
import { getVal, setValKey } from "../utils/redis.utils";

export const getRoomDataService = async (firebaseUid: string) => {

    const user = await User.exists({ firebaseUid })

    if (!user) {
        throw new Error("Unauthorized")
    }

    const cacheKey = "room:all";

    const cached = await getVal(cacheKey);

    if (cached) {
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