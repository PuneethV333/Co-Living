import mongoose from "mongoose";
import z from "zod";

export interface Location {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates: {
        lat: number;
        lng: number;
    };
}

export type PropertyType =
    | "apartment"
    | "house"
    | "villa"
    | "studio"
    | "pg"
    | "hostel"
    | "farmhouse"
    | "office"
    | "shop"
    | "warehouse"
    | "land";

export type AmenityType =
    | "wifi"
    | "parking"
    | "ac"
    | "tv"
    | "kitchen"
    | "washingMachine"
    | "powerBackup"
    | "lift"
    | "gym"
    | "swimmingPool"
    | "security"
    | "petFriendly"
    | "balcony"
    | "garden"
    | "waterSupply"
    | "geyser"
    | "furnished";

export interface IProperty {
    ownerId: mongoose.Types.ObjectId;
    name: string;
    description: string;

    location: Location;

    propertyType: PropertyType;

    cost: number;

    totalRooms: number;
    totalBedRooms: number;
    totalBathrooms: number;

    builtUpArea: number;

    amenities: AmenityType[];

    rules: string[];
    photos: string[];

    verified: boolean;
    isActive: boolean;

    rating: number;
    totalReviews: number;
    embeddingGenerated?: boolean;
    searchText?: string;
    aiTags?: string[];
}

export const createPropertySchema = z.object({
    name: z.string(),
    description: z.string(),
    cost:z.number().positive(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    lat: z.number(),
    lng: z.number(),
    propertyType: z.enum([
        "apartment",
        "house",
        "villa",
        "studio",
        "pg",
        "hostel",
        "farmhouse",
        "office",
        "shop",
        "warehouse",
        "land",
    ]),
    totalRooms: z.number().optional(),
    totalBedRooms: z.number().optional(),
    totalBathrooms: z.number().optional(),
    builtUpArea: z.number().optional(),
    amenities: z.array(z.enum([
        "wifi",
        "parking",
        "ac",
        "tv",
        "kitchen",
        "washingMachine",
        "powerBackup",
        "lift",
        "gym",
        "swimmingPool",
        "security",
        "petFriendly",
        "balcony",
        "garden",
        "waterSupply",
        "geyser",
        "furnished",
    ])),
    rules: z.string().array().optional(),
    photos: z.url().array().optional(),
})

export type createPropertyType = z.infer<typeof createPropertySchema>


export const searchSchema = z.object({
  query: z.string().min(1),
});