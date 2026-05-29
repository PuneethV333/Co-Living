import z from "zod";

export const authResSchema = z.object({
    firebaseUid:z.string(),
    _id:z.string(),
    completeOnBoarding:z.boolean()
})

export type authResType = z.infer<typeof authResSchema>