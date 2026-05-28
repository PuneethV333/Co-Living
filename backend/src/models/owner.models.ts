import { model, Model, models, Schema } from "mongoose";
import { IOwnerData } from "../types/user/ownerData.types";

const ownerSchema = new Schema<IOwnerData>({
  businessName: {
    type: String,
  },
  propertiesCount: {
    type: Number,
    default: 0,
  },
});

export const Owner: Model<IOwnerData> =
  models.Owner || model<IOwnerData>("Owner", ownerSchema, "owner");
