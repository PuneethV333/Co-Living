import type { PropertyTypeEnum } from "../types/property.types";

export const PROPERTY_TYPES: {
    value: PropertyTypeEnum;
    label: string;
    emoji: string;
}[] = [
        { value: "apartment", label: "Apartment", emoji: "🏢" },
        { value: "house", label: "House", emoji: "🏠" },
        { value: "villa", label: "Villa", emoji: "🏡" },
        { value: "studio", label: "Studio", emoji: "🏙️" },
        { value: "pg", label: "PG", emoji: "🏘️" },
        { value: "hostel", label: "Hostel", emoji: "🏨" },
        { value: "farmhouse", label: "Farmhouse", emoji: "🌾" },
    ];

export const SUGGESTIONS = ["Koramangala", "Indiranagar", "Whitefield", "JP Nagar", "Electronic City", "Mumbai", "Pune"];