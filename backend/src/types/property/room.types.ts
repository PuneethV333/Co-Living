import mongoose from "mongoose";
import { AmenityType, createPropertySchema } from "./property.types";
import z from "zod";

export type roomType = "shared" | "private";

export type bedType = "single" | "double" | "bunk";

export interface roomDetails {
    roomType: roomType;
    capacity: number;
    bedType: bedType;
    area: number;
}

export interface IRoom {
    propertyId: mongoose.Types.ObjectId;
    roomDetails: roomDetails;
    pricing: {
        monthlyRent: number;
        securityDeposit: number;
        maintenanceCharges: number;
    };
    amenities: AmenityType[];
    availability: {
        startDate: Date;
        endDate: Date | null;
        currentOccupants: number;
    };
    photos: string[];
}

export const createRoomSchema = z.object({
    createPropertySchema: createPropertySchema,
    capacity: z.number(),
    roomType: z.enum(["shared", "private"]),
    bedType: z.enum(["single", "double", "bunk"]),
    area: z.number(),
    monthlyRent: z.number(),
    securityDeposit: z.number(),
    maintenanceCharges: z.number(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().nullable(),
    currentOccupants: z.number(),
})

export type createRoomType = z.infer<typeof createRoomSchema>