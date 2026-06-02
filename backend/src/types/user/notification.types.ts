import mongoose from "mongoose";
import z from "zod";

export type typesOfMessage = "VISIT_REQUEST" | "MESSAGE" | "BOOKING_UPDATE"

export interface INotification {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  type: typesOfMessage;
  sent:boolean;
}

export const createNotificationSchema = z.object({
    senderId:z.string(),
    receiverId:z.string(),
    type:z.enum(["VISIT_REQUEST","MESSAGE","BOOKING_UPDATE"]),
})

export type createNotificationType = z.infer<typeof createNotificationSchema>