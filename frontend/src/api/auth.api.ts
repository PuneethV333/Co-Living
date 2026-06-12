import { api } from "../config/api.config";
import { userSchema, type resType, type UserType } from "../types/auth.types";
import type { completeOnBoardingPayloadType } from "../types/onBoarding.types";

export const authApi = async (): Promise<resType> => {
    const res = await api.post<resType>("/api/auth/");
    return res.data;
};

export const getMeApi = async (): Promise<UserType> => {
    const res = await api.get("/api/auth/me");
    return userSchema.parse(res.data.data);
};

export const completeOnBoardingApi = async (
    payload: completeOnBoardingPayloadType,
): Promise<UserType> => {
    const res = await api.post("/api/auth/on-boarding", payload);
    return userSchema.parse(res.data.data);
};

export const sendOtpApi = async (phone: string) => {
    const res = await api.post("/api/auth/sendOtp", {
        phone,
    });

    return res.data;
};

export const verifyOtpApi = async ({
    phone,
    otp,
}: {
    phone: string;
    otp: string;
}) => {
    const res = await api.post("/api/auth/verifyOtp", {
        phone,
        otp,
    });

    return res.data;
};

export const sendOtpViaEmailApi = async (email: string) => {
    const res = await api.post("/api/auth/email/sendOtp", {
        email,
    });

    return res.data;
};

export const verifyOtpViaEmailApi = async ({
    email,
    otp,
}: {
    email: string;
    otp: string;
}) => {
    const res = await api.post("/api/auth/email/verifyOtp", {
        email,
        otp,
    });

    return res.data;
};
