import z from "zod";

export const ownerId = z.object({
    name: z.string(),
    phone: z.string(),
    verified: z.boolean()
})


export const getPropertySchema = z.object({
    ownerId: ownerId,
    name: z.string(),
    description: z.string(),
    location: {
        address: z.string(),
        city: z.string(),
        zipCode: z.string(),
        coordinates: {
            lat: z.string(),
            lng: z.string()
        }
    },
    propertyType: z.enum(["apartment",
        "house",
        "villa",
        "studio",
        "pg",
        "hostel",
        "farmhouse",
        "office",
        "shop",
        "warehouse",
        "land",]),
    totalRooms: z.number().default(0),
    totalBedRooms: z.number().default(0),
    totalBathrooms: z.number().default(0),
    builtUpArea: z.number().default(0),
    amenities: z.enum([
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
    ]),
    rules:z.string().array(),
    photos:z.string().array(),
    verified:z.boolean(),
    isActive:z.boolean(),
    rating:z.number().min(0).max(5)
})

export type getPropertyType = z.infer<typeof getPropertySchema>