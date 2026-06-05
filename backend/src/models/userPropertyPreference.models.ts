import { model, Model, models, Schema } from "mongoose";
import { IUserPropertyPreference } from "../types/property/userPropertyPreference.types";

const userPropertyPreferenceSchema = new Schema<IUserPropertyPreference>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    budget: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number
        }
    },
    preferredLocations: {
        type: [String],
    },
    propertyTypes: {
        type: [String],
        enum: ["apartment"
            , "house"
            , "villa"
            , "studio"
            , "pg"
            , "hostel"
            , "farmhouse"
            , "office"
            , "shop"
            , "warehouse"
            , "land"]
    },
    amenities: {
        type: [String],
        enum: ["wifi"
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
            , "furnished"]
    },
    roomPreference: {
        privateRoom: {
            type: Boolean,
            default: false
        },
        sharedRoom: {
            type: Boolean,
            default: false
        },
    },
    genderPreference: {
        type: String,
        enum: ["Male", "Female", "Other", "any"],
        required: true
    },
    occupancyPreference: {
        type: String,
        enum: ["single", "double", "triple", "any"],
        default: "any"
    },
    workMode: {
        type: String,
        enum: ["remote", "hybrid", "office", "any"],
        default: "remote"
    },
    foodPreference: {
        type: String,
        enum: ["veg", "non-veg", "any"],
        default: "non-veg"
    },
    petFriendly: {
        type: Boolean,
        default: false
    },
    transportNeeds: {
        metroNearby: {
            type: Boolean,
            default: true
        },
        parkingRequired: {
            type: Boolean,
            default: true
        },
    },
})

export const PropertyPreference: Model<IUserPropertyPreference> = models.userPropertyPreference || model<IUserPropertyPreference>("PropertyPreference", userPropertyPreferenceSchema, "propertyPreference")