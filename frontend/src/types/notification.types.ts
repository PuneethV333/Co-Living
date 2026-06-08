import z from "zod"

export const senderIdSchema = z.object({
    _id: z.string(),
    name: z.string(),
    phoneNumber: z.string(),
    profilePic: z.url()
})

export const notificationSchema = z.object({
    _id: z.string(),
    senderId: senderIdSchema,
    receiverId: z.string(),
    type: z.enum([
        "VISIT_REQUEST",
        "MESSAGE",
        "BOOKING_UPDATE",
        "ACCEPT_VISIT_REQUEST",
        "REJECT_VISIT_REQUEST"
    ]),
    sent: z.boolean(),
    replied: z.boolean(),
    requiresAction: z.boolean(),
    createdAt: z.coerce.date()
})

export type notificationType = z.infer<typeof notificationSchema>

export const notificationsSchema = z.array(notificationSchema)
export type notificationsType = z.infer<typeof notificationsSchema>

export const createNotificationSchema = z.object({
    senderId: z.string(),
    receiverId: z.string(),
    type: z.enum([
        "VISIT_REQUEST",
        "MESSAGE",
        "BOOKING_UPDATE",
        "ACCEPT_VISIT_REQUEST",
        "REJECT_VISIT_REQUEST"
    ])
})

export type createNotificationType = z.infer<typeof createNotificationSchema>

export const replyToMessageSchema = z.object({
    toId: z.string(),
    messageId: z.string(),
    type: z.enum(["VISIT_REQUEST", "MESSAGE", "BOOKING_UPDATE", "ACCEPT_VISIT_REQUEST", "REJECT_VISIT_REQUEST"]),
})

export type replyToMessageType = z.infer<typeof replyToMessageSchema>