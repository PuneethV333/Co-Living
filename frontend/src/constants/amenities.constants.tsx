import {
    Wifi,
    Car,
    Wind,
    Tv,
    UtensilsCrossed,
    WashingMachine,
    Zap,
    ArrowUpDown,
    Dumbbell,
    Waves,
    Shield,
    PawPrint,
    TreePine,
    Droplets,
    Thermometer,
    Sofa,
    Home,
    Building2,
    Monitor,
    Users,
    MapPin,
} from "lucide-react";
import type { AmenityEnum, PropertyTypeEnum } from "../types/property.types";

export const AMENITIES: {
    value: AmenityEnum;
    label: string;
    icon: React.ReactNode;
}[] = [
        { value: "wifi", label: "Fast WiFi", icon: <Wifi size={20} /> },
        { value: "parking", label: "Parking", icon: <Car size={20} /> },
        { value: "ac", label: "Air Conditioning", icon: <Wind size={20} /> },
        { value: "tv", label: "Smart TV", icon: <Tv size={20} /> },
        { value: "kitchen", label: "Kitchen", icon: <UtensilsCrossed size={20} /> },
        { value: "swimmingPool", label: "Pool", icon: <Waves size={20} /> },
        { value: "gym", label: "Gym", icon: <Dumbbell size={20} /> },
        {
            value: "washingMachine",
            label: "Laundry",
            icon: <WashingMachine size={20} />,
        },
        { value: "powerBackup", label: "Power Backup", icon: <Zap size={20} /> },
        { value: "lift", label: "Lift", icon: <ArrowUpDown size={20} /> },
        { value: "security", label: "Security", icon: <Shield size={20} /> },
        { value: "petFriendly", label: "Pet Friendly", icon: <PawPrint size={20} /> },
        { value: "balcony", label: "Balcony", icon: <Home size={20} /> },
        { value: "garden", label: "Garden", icon: <TreePine size={20} /> },
        { value: "waterSupply", label: "Water Supply", icon: <Droplets size={20} /> },
        { value: "geyser", label: "Geyser", icon: <Thermometer size={20} /> },
        { value: "furnished", label: "Furnished", icon: <Sofa size={20} /> },
    ];
    
    
export const PROPERTY_TYPES: { value: PropertyTypeEnum; label: string; icon: React.ReactNode }[] = [
  { value: "apartment",  label: "Apartment",  icon: <Building2 size={24} /> },
  { value: "house",      label: "House",      icon: <Home size={24} /> },
  { value: "villa",      label: "Villa",      icon: <Home size={24} /> },
  { value: "studio",     label: "Studio",     icon: <Monitor size={24} /> },
  { value: "pg",         label: "PG",         icon: <Users size={24} /> },
  { value: "hostel",     label: "Hostel",     icon: <Building2 size={24} /> },
  { value: "farmhouse",  label: "Farmhouse",  icon: <TreePine size={24} /> },
  { value: "office",     label: "Office",     icon: <Building2 size={24} /> },
  { value: "land",       label: "Land",       icon: <MapPin size={24} /> },
];