import { success } from "zod";
import { config } from "../config/data.config";
import { resendConfig } from "../config/resend.config";
import { twilioClient } from "../config/tiwlio.config";
import { Owner } from "../models/owner.models";
import { Tenant } from "../models/tenant.models";
import { User } from "../models/user.models";
import {
    completeOnBoardingReqBodyType,
    GetMeServiceResponse,
    phoneNoType,
    verifyOtpType,
} from "../types/user/auth.types";
import { clearCache, getVal, setValKey } from "../utils/redis.utils";
import { nodeMailer } from "../config/nodeMailer.config";

export const handleAuth = async (firebaseUid: string) => {
    let user = await User.findOne({ firebaseUid }).lean();
    let isNewUser = false;

    if (!user) {
        const created = await User.create({
            firebaseUid,
            completeOnBoarding: false,
            verified: false,
            role: "Tenant",
        });
        user = created.toObject();
        isNewUser = true;
    }

    const cacheKey = `session:${firebaseUid}`;
    await setValKey(cacheKey, JSON.stringify(user), 3600);

    if (!user) throw new Error("failed to log user");

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

    await setValKey(cacheKey, JSON.stringify(user), 3600);

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
        if (!payload.ownerProfile?.businessName) {
            throw new Error("Business name is required for Owner role");
        }
        ownerProfile = await Owner.create({
            businessName: payload.ownerProfile.businessName,
        });
    } else {
        if (!payload.tenantProfile?.occupationStatus) {
            throw new Error("Occupation status is required for Tenant role");
        }
        tenantProfile = await Tenant.create({
            occupationStatus: payload.tenantProfile.occupationStatus,
            income: payload.tenantProfile.monthlyIncome,
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
            completeOnBoarding: true,
            ...(ownerProfile && { ownerProfile: ownerProfile._id }),
            ...(tenantProfile && { tenantProfile: tenantProfile._id }),
        },
        { returnDocument: "after" }
    ).populate(
        payload.role === "Owner"
            ? "ownerProfile"
            : "tenantProfile"
    );

    const cacheKey = `user:${firebaseUid}`;
    await setValKey(cacheKey, JSON.stringify(user), 3600);

    return { user, success: true };
};

export const sendOtpService = async ({ phone }: phoneNoType) => {
    await twilioClient.verify.v2
        .services(config.serviceSid)
        .verifications.create({
            to: phone,
            channel: "sms",
        });

    return { success: true };
};

export const verifyOtpService = async ({ phone, otp }: verifyOtpType) => {
    const result = await twilioClient.verify.v2
        .services(config.serviceSid)
        .verificationChecks.create({
            to: phone,
            code: otp,
        });

    return {
        verified: result.status === "approved",
    };
};

export const sendOtpViaEmailService = async (email: string) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await nodeMailer.sendMail({
        from: config.email,
        to: email,
        subject: "Verify your Email",
        html: `<h2>Your OTP is ${otp}</h2>`
    })
    const cacheKey = `otp:email:${email}`
    await setValKey(cacheKey, otp, 300)

    return { success: true }
}

export const verifyOtpViaEmailService = async (email: string, opt: string) => {
    const cacheKey = `otp:email:${email}`
    const optCached = await getVal(cacheKey)
    if (!optCached) {
        return { success: false }
    }

    if (opt === optCached) {
        await clearCache(cacheKey)
        return { success: true }
    }

    return { success: false }
}   