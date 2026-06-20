import { z } from "zod";

export const tenantProfileSchema = z.object({
  occupationStatus: z.enum(["student", "working-professional", "other"]),
  monthlyIncome: z.number(),
});

export const ownerProfileSchema = z.object({
  businessName: z.string(),
});

export const completeOnBoardingPayloadSchema = z.object({
  name: z.string(),
  profilePic: z.string().url(),
  dob: z.coerce.date(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  role: z.enum(["Tenant", "Owner"]),
  bio: z.string().optional(),
  verified: z.boolean(),
  tenantProfile: tenantProfileSchema.optional(),
  ownerProfile: ownerProfileSchema.optional(),
});

export type completeOnBoardingPayloadType = z.infer<
  typeof completeOnBoardingPayloadSchema
>;

export type Role = "Tenant" | "Owner";
export type OccupationStatus = "student" | "working-professional" | "other";

export interface Step1Data {
  profilePic: string;
  profileFile: File | null;
  name: string;
  dob: string;
  role: Role;
  bio: string;
}

export interface Step2TenantData {
  occupationStatus: OccupationStatus;
  monthlyIncome: number;
}

export interface Step2OwnerData {
  businessName: string;
}