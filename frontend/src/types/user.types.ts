import z from "zod"

export const userUpdateSchema = z.object({
    name:z.string(),
    profilePic:z.string(),
    bio:z.string(),
    email:z.string(),
    phoneNumber:z.string(),
})

export type userUpdateType = z.infer<typeof userUpdateSchema>