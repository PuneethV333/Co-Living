import { Request, Response } from "express";
import { getError } from "../utils/error.utils";
import {
    completeOnBoardingServices,
    getMeServices,
    handleAuth,
    sendOtpService,
    sendOtpViaEmailService,
    verifyOtpService,
    verifyOtpViaEmailService,
} from "../services/auth.services";
import {
    authResType,
    completeOnBoardingReqBodySchema,
    opt,
    phoneNoSchema,
    verifyOtpSchema,
    verifyOtpViaEmailSchema,
} from "../types/user/auth.types";

export const auth = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "firebaseUid not found",
            });
        }

        const { user, isNewUser } = await handleAuth(firebaseUid);

        const data: authResType = {
            firebaseUid: user.firebaseUid,
            _id: user._id.toString(),
            completeOnBoarding: user.completeOnBoarding,
        };

        return res.status(isNewUser ? 201 : 200).json({
            data: data,
            message: isNewUser ? "User created" : "User exists",
        });
    } catch (err) {
        res.status(500).json(getError(err));
    }
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const result = await getMeServices(firebaseUid);

        if (!result) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            data: result.data,
            source: result.source,
        });
    } catch (err) {
        return res.status(500).json(getError(err));
    }
};

export const completeOnBoarding = async (req: Request, res: Response) => {
    try {
        const firebaseUid = req.user?.firebaseUid;

        if (!firebaseUid) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        const parsed = completeOnBoardingReqBodySchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "schema mismatch",
                error: parsed.error.message,
            });
        }

        const result = await completeOnBoardingServices(firebaseUid, parsed.data);

        return res.status(200).json({
            data: result.user,
            success: result.success,
        });
    } catch (err) {
        res.status(500).json(getError(err));
    }
};

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const parsed = phoneNoSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "invalid phone number"
            })
        }

        const result = await sendOtpService(parsed.data)

        return res.status(200).json({
            success: result.success
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
};

export const verifyOtp = async (
    req: Request,
    res: Response
) => {
    try {
        const parsed = verifyOtpSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
            });
        }

        const result = await verifyOtpService(parsed.data);

        if (!result.verified) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Phone verified",
        });
    } catch (err) {
        return res.status(500).json(getError(err));
    }
};

export const sendOtpViaEmail = async (req: Request, res: Response) => {
    try {
        const parsed = opt.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: "invalid phone number"
            })
        }

        const result = await sendOtpViaEmailService(parsed.data.email)

        return res.status(200).json({
            success: result.success
        })
    } catch (err) {
        res.status(500).json(getError(err))
    }
};

export const verifyOtpViaEmail = async (
    req: Request,
    res: Response
) => {
    try {
        const parsed = verifyOtpViaEmailSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                message: "Invalid input",
            });
        }

        const result = await verifyOtpViaEmailService(parsed.data.email, parsed.data.otp);

        if (!result.success) {
            return res.status(400).json({
                message: "Invalid OTP",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Phone verified",
        });
    } catch (err) {
        return res.status(500).json(getError(err));
    }
};

