import { Model, model, models, Schema } from "mongoose";
import { INotification } from "../types/user/notification.types";

const notificationSchema = new Schema<INotification>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum:["VISIT_REQUEST","MESSAGE","BOOKING_UPDATE"],
        required: true,
    },
    sent:{
        type:Boolean,
        default:false
    }
}, { timestamps: true })


export const Notification: Model<INotification> = models.Notification || model<INotification>("Notification", notificationSchema, "notification")
