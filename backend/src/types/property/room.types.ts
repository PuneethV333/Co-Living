import mongoose from "mongoose";
import { AmenityType } from "./property.types";

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
