import mongoose from "mongoose";
import z from "zod";

export type typesOfMessage = "VISIT_REQUEST" | "MESSAGE" | "BOOKING_UPDATE" | "ACCEPT_VISIT_REQUEST" | "REJECT_VISIT_REQUEST"

export interface INotification {
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    type: typesOfMessage;
    sent: boolean;
    replied: boolean;
    requiresAction: boolean;
}

export const createNotificationSchema = z.object({
    senderId: z.string(),
    receiverId: z.string(),
    type: z.enum(["VISIT_REQUEST", "MESSAGE", "BOOKING_UPDATE", "ACCEPT_VISIT_REQUEST", "REJECT_VISIT_REQUEST"]),
})

export type createNotificationType = z.infer<typeof createNotificationSchema>

export const replyToMessageSchema = z.object({
    firebaseUid: z.string(),
    toId: z.string(),
    messageId: z.string(),
    type: z.enum(["VISIT_REQUEST", "MESSAGE", "BOOKING_UPDATE", "ACCEPT_VISIT_REQUEST", "REJECT_VISIT_REQUEST"]),
})

export type replyToMessageType = z.infer<typeof replyToMessageSchema>

export const replyToMessageReqBody = z.object({
    toId: z.string(),
    messageId: z.string(),
    type: z.enum(["VISIT_REQUEST", "MESSAGE", "BOOKING_UPDATE", "ACCEPT_VISIT_REQUEST", "REJECT_VISIT_REQUEST"]),
})

export type replyToMessageReqBodyType = z.infer<typeof replyToMessageReqBody>