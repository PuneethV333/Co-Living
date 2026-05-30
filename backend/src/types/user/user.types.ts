import mongoose from "mongoose";

export interface preferencesType {
    genderPreference:"Male"|"Female"|"Other",
    minBudgetRange: number,
    maxBudgetRange: number,
    preferredAmenities: string[],
    preferredLocations: string[],
    workingHours: string,
    smokingAllowed: boolean,
    petsAllowed: boolean,
}

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
    phoneNumber:string
}