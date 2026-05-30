import { Owner } from "../models/owner.models";
import { Tenant } from "../models/tenant.models";
import { User } from "../models/user.models";
import {
  completeOnBoardingReqBodyType,
  GetMeServiceResponse,
} from "../types/user/auth.types";
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

export const getMeServices = async (
  firebaseUid: string,
): Promise<GetMeServiceResponse> => {
  const cacheKey = `user:${firebaseUid}`;

  const cached = await getVal(cacheKey);

  if (cached) {
    return {
      data: JSON.parse(cached),
      source: "redis",
    };
  }

  const user = await User.findOne({ firebaseUid })
    .populate("tenantProfile")
    .populate("ownerProfile")
    .lean();

  if (!user) {
    return null;
  }

  await setValKey(cacheKey, JSON.stringify(user));

  return {
    data: user,
    source: "db",
  };
};

export const completeOnBoardingServices = async (
  firebaseUid: string,
  payload: completeOnBoardingReqBodyType,
) => {
  const existingUser = await User.findOne({ firebaseUid });

  if (!existingUser) {
    throw new Error("User not found");
  }

  if (existingUser.completeOnBoarding) {
    throw new Error("Onboarding already completed");
  }

  let ownerProfile = null;
  let tenantProfile = null;
  if (payload.role === "Owner") {
    ownerProfile = await Owner.create({
      businessName: payload.ownerProfile?.businessName,
    });
  } else {
    tenantProfile = await Tenant.create({
      occupationStatus: payload.tenantProfile?.occupationStatus,
      income: payload.tenantProfile?.monthlyIncome,
    });
  }

  const user = await User.findOneAndUpdate(
    { firebaseUid },
    {
      name: payload.name,
      role: payload.role,
      profilePic: payload.profilePic,
      dob: payload.dob,
      phoneNumber: payload.phoneNumber,
      email: payload.email,
      bio: payload.bio,
      verified: payload.verified,
      tenantProfile: tenantProfile?._id ?? null,
      ownerProfile: ownerProfile?._id ?? null,
      completeOnBoarding: true,
    },
    { returnDocument: "after" },
  );

  const cacheKey = `user:${firebaseUid}`;
  await setValKey(cacheKey, JSON.stringify(user), 3600);

  return { user, success: "true" };
};
