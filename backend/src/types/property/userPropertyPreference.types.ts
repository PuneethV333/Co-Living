import mongoose from "mongoose";
import { AmenityType, PropertyType } from "./property.types";
import z from "zod";

export type occupancyPreference = "single" | "double" | "triple" | "any"

export interface IUserPropertyPreference {
    userId: mongoose.Types.ObjectId,

    budget: {
        min: number,
        max: number,
    },

    preferredLocations: string[],

    propertyTypes: PropertyType[], // apartment, pg, villa, hostel

    amenities: AmenityType[],

    roomPreference: {
        privateRoom: boolean,
        sharedRoom: boolean,
    },

    genderPreference: "Male" | "Female" | "Other" | "any", // male, female, any

    occupancyPreference: occupancyPreference

    workMode: "remote" | "hybrid" | "office" | "any", // remote, hybrid, office

    foodPreference: "veg" | "non-veg" | "any",// veg, non-veg, vegan

    petFriendly: boolean,


    transportNeeds: {
        metroNearby: boolean,
        parkingRequired: boolean,
    },
};


export const createUserPropertyPreferencePayloadSchema = z.object({
    max: z.number().optional(),
    min: z.number(),
    preferredLocations: z.array(z.string()),
    propertyTypes: z.array(z.enum(["apartment"
        , "house"
        , "villa"
        , "studio"
        , "pg"
        , "hostel"
        , "farmhouse"
        , "office"
        , "shop"
        , "warehouse"
        , "land"])),
    amenities: z.array(z.enum([
        "wifi"
        , "parking"
        , "ac"
        , "tv"
        , "kitchen"
        , "washingMachine"
        , "powerBackup"
        , "lift"
        , "gym"
        , "swimmingPool"
        , "security"
        , "petFriendly"
        , "balcony"
        , "garden"
        , "waterSupply"
        , "geyser"
        , "furnished"
    ])),
    privateRoom: z.boolean(),
    sharedRoom: z.boolean(),
    genderPreference: z.enum(["Male", "Female", "Other", "any"]),
    occupancyPreference: z.enum(["single", "double", "triple", "any"]),
    workMode: z.enum(["remote", "hybrid", "office", "any"]),
    foodPreference: z.enum(["veg", "non-veg", "any"]),
    petFriendly: z.boolean(),
    metroNearby: z.boolean(),
    parkingRequired: z.boolean()
})

export type createUserPropertyPreferencePayloadType = z.infer<typeof createUserPropertyPreferencePayloadSchema>


