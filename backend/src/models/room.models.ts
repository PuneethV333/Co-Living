import { model, Model, models, Schema } from "mongoose";
import { IRoom } from "../types/property/room.types";

const roomSchema = new Schema<IRoom>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
      index: true,
    },

    roomDetails: {
      roomType: {
        type: String,
        enum: ["shared", "private"],
        required: true,
      },

      capacity: {
        type: Number,
        required: true,
        min: 1,
      },

      bedType: {
        type: String,
        enum: ["single", "double", "bunk"],
        required: true,
      },

      area: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    pricing: {
      monthlyRent: {
        type: Number,
        required: true,
        min: 0,
      },

      securityDeposit: {
        type: Number,
        required: true,
        min: 0,
      },

      maintenanceCharges: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    amenities: {
      type: [String],

      enum: [
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
      ],

      default: [],
    },

    availability: {
      startDate: {
        type: Date,
        required: true,
      },

      endDate: {
        type: Date,
        default: null,
      },

      currentOccupants: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    photos: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

roomSchema.index({
  propertyId: 1,
});

roomSchema.index({
  "pricing.monthlyRent": 1,
});

export const Room: Model<IRoom> =
  models.Room || model<IRoom>("Room", roomSchema, "room");
