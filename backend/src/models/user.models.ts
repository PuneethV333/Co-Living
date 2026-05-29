import { models, Schema, model, Model } from "mongoose";
import { IUser } from "../types/user/user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["Tenant", "Owner", "Admin"],
      default: "Tenant",
      index: true,
    },
    dob: {
      type: Date,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      validate: {
        validator: function (value: string) {
          if (!value) return true;
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: "Invalid email format",
      },
      required: true,
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/deymewscv/image/upload/v1760774522/hqoltmqamhhjfz7divf1.jpg",
    },
    bio: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
      index: true,
    },
    tenantProfile: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Tenant",
      index: true,
    },
    ownerProfile: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: "Owner",
      index: true,
    },
    completeOnBoarding:{
        type:Boolean,
        default:false
    }
  },
  
  { timestamps: true },
);

userSchema.index({ role: 1, verified: 1 });
userSchema.index({ firebaseUid: 1, role: 1 });

userSchema.pre("save", async function () {
  if (this.role === "Tenant") {
    this.ownerProfile = null;
  }

  if (this.role === "Owner") {
    this.tenantProfile = null;
  }
});

export const User: Model<IUser> =
  models.User || model<IUser>("User", userSchema, "user");
