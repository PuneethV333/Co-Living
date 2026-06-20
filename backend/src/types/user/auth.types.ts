import z from "zod";
import { IUser } from "./user.types";

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authResSchema = z.object({
  firebaseUid: z.string(),
  _id: z.string(),
  completeOnBoarding: z.boolean(),
});

export type authResType = z.infer<typeof authResSchema>;

export type GetMeServiceResponse = {
  data: IUser;
  source: "redis" | "db";
} | null;

// ── Onboarding ────────────────────────────────────────────────────────────────

export const tenantProfileSchema = z.object({
  occupationStatus: z.enum(["student", "working-professional", "other"]),
  monthlyIncome: z.number(),
});

export const ownerProfileSchema = z.object({
  businessName: z.string(),
});

export const completeOnBoardingReqBodySchema = z.object({
  name: z.string(),
  profilePic: z
    .string()
    .url()
    .default(
      "https://res.cloudinary.com/deymewscv/image/upload/v1760774522/hqoltmqamhhjfz7divf1.jpg"
    ),
  dob: z.coerce.date(),
  email: z.string().email().nullish(),
  phoneNumber: z.string().nullish(),
  role: z.enum(["Tenant", "Owner"]),
  bio: z.string().nullish(),
  verified: z.boolean().default(false),
  tenantProfile: tenantProfileSchema.nullish(),
  ownerProfile: ownerProfileSchema.nullish(),
});

export type completeOnBoardingReqBodyType = z.infer<
  typeof completeOnBoardingReqBodySchema
>;

export const phoneNoSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^\+[1-9]\d{7,14}$/),
  otp: z.string().length(6),
});

export type phoneNoType = z.infer<typeof phoneNoSchema>;
export type verifyOtpType = z.infer<typeof verifyOtpSchema>;

export const opt = z.object({
    email:z.email()
})

export const verifyOtpViaEmailSchema = z.object({
    email:z.email(),
    otp:z.string().length(6)
})