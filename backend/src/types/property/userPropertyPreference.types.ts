import mongoose from "mongoose";
import { AmenityType, PropertyType } from "./property.types";

export type occupancyPreference = "single"| "double"| "triple"|"any" 

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
        privateRoom: Boolean,
        sharedRoom: Boolean,
    },

    genderPreference: "Male" | "Female" | "Other"|"any", // male, female, any

    occupancyPreference: occupancyPreference

    workMode: "remote"| "hybrid"| "office"|"any", // remote, hybrid, office

    foodPreference: "veg"| "non-veg" |"any" // veg, non-veg, vegan

    petFriendly: boolean,


    transportNeeds: {
        metroNearby: boolean,
        parkingRequired: boolean,
    },
};