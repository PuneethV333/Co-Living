import z from "zod"

export const senderIdSchema = z.object({
    name:z.string(),
    phoneNumber:z.string(),
    profilePic:z.url()
})


export const notificationSchema = z.object({
    senderId: senderIdSchema,
    receiverId: z.string(),
    type: z.enum(["VISIT_REQUEST", "MESSAGE", "BOOKING_UPDATE"]),
    sent: z.boolean(),
    createdAt:z.coerce.date()
})

export type notificationType = z.infer<typeof notificationSchema>


export const notificationsSchema = z.array(notificationSchema)
export type notificationsType = z.infer<typeof notificationsSchema>