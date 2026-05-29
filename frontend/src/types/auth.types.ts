import { z } from "zod";

export const authResSchema = z.object({
  firebaseUid: z.string(),
  _id: z.string(),
  completeOnBoarding: z.boolean(),
});

export type authResType = z.infer<typeof authResSchema>;

export const res = z.object({
  data: authResSchema,
  message: z.string(),
});

export type resType = z.infer<typeof res>;

export const ownerSchema = z.object({
  businessName: z.string(),
  propertiesCount: z.number(),
});

export const tenantSchema = z.object({
  occupationStatus: z.enum(["student", "working-professional", "other"]),
  income: z.number(),
});

export const userSchema = z.object({
  _id: z.string(),

  role: z.enum(["Tenant", "Owner", "Admin"]),

  dob: z.coerce.date().optional(),

  email: z.email(),

  profilePic: z.url(),

  bio: z.string().optional(),

  verified: z.boolean(),

  completeOnBoarding: z.boolean(),

  createdAt: z.coerce.date(),

  updatedAt: z.coerce.date(),

  tenantProfile: tenantSchema.optional(),

  ownerProfile: ownerSchema.optional(),
});

export type UserType = z.infer<typeof userSchema>;
