import mongoose from "mongoose";
import z from "zod";

export interface IUser {
    name:string,
    role:"Tenant"| "Owner"| "Admin",
    dob:Date,
    firebaseUid:string,
    email:string,
    profilePic:string,
    bio:string,
    verified:boolean,
    tenantProfile:mongoose.Types.ObjectId | null,
    ownerProfile:mongoose.Types.ObjectId|null,
    completeOnBoarding:boolean,
    phoneNumber:string,
    saved:mongoose.Types.ObjectId[]
}

export const userUpdateSchema = z.object({
    name:z.string(),
    profilePic:z.string(),
    bio:z.string(),
    email:z.string(),
    phoneNumber:z.string(),
})

export type userUpdateType = z.infer<typeof userUpdateSchema>