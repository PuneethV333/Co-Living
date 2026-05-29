import mongoose from "mongoose";

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
