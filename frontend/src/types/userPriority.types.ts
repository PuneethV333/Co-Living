import z from "zod"

export const budget = z.object({
    min: z.number(),
    max: z.number(),
})

export const roomPreference = z.object({
    privateRoom: z.boolean(),
    sharedRoom: z.boolean(),
})

export const transportNeeds = z.object({
    metroNearby: z.boolean(),
    parkingRequired: z.boolean()
})

export const userPropertyPreferenceSchema = z.object({
    _id: z.string(),
    userId: z.string(),
    budget: budget,
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
    roomPreference: roomPreference,
    genderPreference: z.enum(["Male", "Female", "Other", "any"]),
    occupancyPreference: z.enum(["single", "double", "triple", "any"]),
    workMode: z.enum(["remote", "hybrid", "office", "any"]),
    foodPreference: z.enum(["veg", "non-veg", "any"]),
    petFriendly: z.boolean(),
    transportNeeds: transportNeeds,
});

export type userPropertyPreferenceType = z.infer<typeof userPropertyPreferenceSchema>

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


export const getRoommatePreferenceSchema = z.object({
    _id: z.string(),
    userId: z.string(),

    budget: z.object({
        min: z.number(),
        max: z.number(),
    }),

    preferredLocations: z.array(z.string()),

    propertyTypes: z.array(
        z.enum([
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
        ])
    ),

    amenities: z.array(z.string()),

    roomPreference: z.object({
        privateRoom: z.boolean(),
        sharedRoom: z.boolean(),
    }),

    genderPreference: z.string(),
    occupancyPreference: z.string(),
    workMode: z.string(),
    foodPreference: z.string(),

    petFriendly: z.boolean(),

    transportNeeds: z.object({
        metroNearby: z.boolean(),
        parkingRequired: z.boolean(),
    }),
});

export type getRoomMatePreferenceType = z.infer<typeof getRoommatePreferenceSchema>