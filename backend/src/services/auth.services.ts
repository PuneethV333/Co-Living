import { User } from "../models/user.models";
import { GetMeServiceResponse } from "../types/user/auth.types";
import { getVal, setValKey } from "../utils/redis.utils";

export const handleAuth = async (firebaseUid: string) => {
  let user = await User.findOne({ firebaseUid }).lean();

  let isNewUser = false;

  if (!user) {
    user = await User.create({
      firebaseUid: firebaseUid,
    });
    isNewUser = true;
  }

  const cacheKey = `session:${firebaseUid}`;
  await setValKey(cacheKey, JSON.stringify(user), 3600);
  return { user, isNewUser };
};

export const getMeServices = async (firebaseUid: string) : Promise<GetMeServiceResponse>=> {
  const cacheKey = `user:${firebaseUid}`;

  const cached = await getVal(cacheKey);

  if (cached) {
    return {
      data: JSON.parse(cached),
      source: "redis",
    };
  }

  const user = await User.findOne({ firebaseUid }).lean();

  if (!user) {
    return null;
  }

  await setValKey(cacheKey, JSON.stringify(user));

  return {
    data: user,
    source: "db",
  };
};
