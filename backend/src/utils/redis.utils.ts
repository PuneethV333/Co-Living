import { redisClient } from "../config/redis.config";

export const getVal = async (cacheKey: string) => {
  try {
    if (!cacheKey) {
      throw new Error("cacheKey not given");
    }

    const res = await redisClient.get(cacheKey);
    return res;
  } catch (err) {
    return null;
  }
};

export const setValKey = async (key: string, data: string, Exp = 600) => {
  if (!key || !data) {
    throw new Error("provide all inputs");
  }

  await redisClient.set(key, data, { EX: Exp });
};

export const clearCache = async (cacheKey: string) => {
  const keys = await redisClient.keys(cacheKey);

  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};
