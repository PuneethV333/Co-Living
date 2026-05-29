import mongoose, { model, Model, Schema, models } from "mongoose";
import { IProperty } from "../types/property/property.types";

const propertySchema = new Schema<IProperty>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      maxLength: 100,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      maxLength: 1000,
      trim: true,
    },

    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      zipCode: {
        type: String,
        required: true,
        trim: true,
      },

      coordinates: {
        lat: {
          type: Number,
          default: null,
        },

        lng: {
          type: Number,
          default: null,
        },
      },
    },

    propertyType: {
      type: String,

      enum: [
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
      ],

      required: true,
    },

    totalRooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalBedRooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalBathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },

    builtUpArea: {
      type: Number,
      default: 0,
      min: 0,
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

    rules: {
      type: [String],
      default: [],
    },

    photos: {
      type: [String],
      default: [],
    },

    verified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    embeddingGenerated: {
      type: Boolean,
      default: false,
    },

    searchText: {
      type: String,
      default: "",
      trim: true,
    },

    aiTags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

propertySchema.index({
  name: "text",
  description: "text",
  searchText: "text",
});

export const Property: Model<IProperty> =
  models.Property || model<IProperty>("Property", propertySchema, "property");
