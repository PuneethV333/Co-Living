import { User } from "../models/user.models";
import { setValKey } from "../utils/redis.utils";

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
