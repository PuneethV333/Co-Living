import { z } from "zod";


export const ownerIdSchema = z.object({
    _id: z.string(),
    name: z.string(),
    verified: z.boolean(),
    phoneNumber: z.string(),
});

export const propertySchema = z.object({
    _id: z.string(),
    ownerId: ownerIdSchema,
    name: z.string(),
    description: z.string(),
    location: z.object({
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipCode: z.string(),
        coordinates: z.object({
            lat: z.number(),
            lng: z.number(),
        }),
    }),
    propertyType: z.enum([
        "apartment", "house", "villa", "studio", "pg",
        "hostel", "farmhouse", "office", "shop", "warehouse", "land",
    ]),
    cost: z.number(),
    totalRooms: z.number(),
    totalBedRooms: z.number(),
    totalBathrooms: z.number(),
    builtUpArea: z.number(),
    amenities: z.array(z.string()),
    rules: z.array(z.string()),
    photos: z.array(z.string()),
    verified: z.boolean(),
    isActive: z.boolean(),
    rating: z.number(),
    totalReviews: z.number(),
    embeddingGenerated: z.boolean(),
    searchText: z.string(),
    aiTags: z.array(z.string()),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const propertiesResponseSchema = z.object({
    data: z.array(propertySchema),
    message: z.string().optional(),
});

export type PropertyType = z.infer<typeof propertySchema>;
export type PropertiesResponse = z.infer<typeof propertiesResponseSchema>;

export const roomSchema = z.object({
    _id: z.string(),
    propertyId: z.string(),
    roomDetails: z.object({
        roomType: z.enum(["shared", "private"]),
        capacity: z.number(),
        bedType: z.enum(["single", "double", "bunk"]),
        area: z.number(),
    }),
    pricing: z.object({
        monthlyRent: z.number(),
        securityDeposit: z.number(),
        maintenanceCharges: z.number(),
    }),
    amenities: z.array(z.string()),
    availability: z.object({
        startDate: z.coerce.date(),
        endDate: z.coerce.date().nullable(),
        currentOccupants: z.number(),
    }),
    photos: z.array(z.string()),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

export const roomsResponseSchema = z.object({
    data: z.array(roomSchema),
    message: z.string().optional(),
});

export type RoomType = z.infer<typeof roomSchema>;
export type RoomsResponse = z.infer<typeof roomsResponseSchema>;


const PROPERTY_EMOJIS: Record<string, string> = {
    apartment: "🏢", house: "🏠", villa: "🏡",
    studio: "🏙️", pg: "🏘️", hostel: "🏨",
    farmhouse: "🌾", office: "🏢", shop: "🏪",
    warehouse: "🏭", land: "🌿",
};

export const getPropertyEmoji = (type: string) =>
    PROPERTY_EMOJIS[type] ?? "🏠";


export type propertyOwnerType = z.infer<typeof ownerIdSchema>

export interface MobileLayoutProps {
    mapRef: React.RefObject<HTMLDivElement | null>;
    mapCollapsed: boolean;
    hasCoords: boolean;
    coords: { lat: number; lng: number };
    property: PropertyType;
    setMapCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
    activeTab: string;
    contentRef: React.RefObject<HTMLDivElement | null>;
    emoji: string;
    scrollToSection: (id: string) => void;
}

export interface DesktopLayoutProps {
    mapOpen: boolean;
    setMapOpen: React.Dispatch<React.SetStateAction<boolean>>;
    hasCoords: boolean;
    coords: { lat: number; lng: number };
    property: PropertyType;
    activeTab: string;
    contentRef: React.RefObject<HTMLDivElement | null>;
    emoji: string;
    scrollToSection: (id: string) => void;
}

export const createPropertySchema = z.object({
    name: z.string(),
    description: z.string(),
    cost: z.number().positive(),
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

export type PropertyTypeEnum =
  | "apartment" | "house" | "villa" | "studio" | "pg"
  | "hostel" | "farmhouse" | "office" | "shop" | "warehouse" | "land";

export type AmenityEnum =
  | "wifi" | "parking" | "ac" | "tv" | "kitchen" | "washingMachine"
  | "powerBackup" | "lift" | "gym" | "swimmingPool" | "security"
  | "petFriendly" | "balcony" | "garden" | "waterSupply" | "geyser" | "furnished";
