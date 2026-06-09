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
  name:z.string().optional(),
  phoneNumber:z.string().optional(),
  role: z.enum(["Tenant", "Owner", "Admin"]),
  dob: z.coerce.date().optional(),
  email: z.email(),
  profilePic: z.url(),
  bio: z.string().optional(),
  verified: z.boolean(),
  completeOnBoarding: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  tenantProfile: tenantSchema.nullable(),
  ownerProfile: ownerSchema.nullable(),
});

export type UserType = z.infer<typeof userSchema>;

export const signInViaEmailSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type SignInViaEmailType = z.infer<typeof signInViaEmailSchema>;

export const signUpViaEmailSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
});

export type SignUpViaEmailType = z.infer<typeof signUpViaEmailSchema>;

export type Mode = "login" | "signup";

export type City = "Bengaluru" | "Mumbai" | "Delhi" | "Pune" | "Hyderabad";
export type RoomType = "Shared" | "Private";
export type PropertyType = "Apartment" | "House" | "Condo";
export type Amenity = "WiFi" | "AC" | "Gym" | "Parking" | "Laundry" | "CCTV";
export type Gender = "Any" | "Male" | "Female";