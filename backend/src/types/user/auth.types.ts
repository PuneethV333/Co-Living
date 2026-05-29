import z from "zod";
import { IUser } from "./user.types";

export const authResSchema = z.object({
    firebaseUid:z.string(),
    _id:z.string(),
    completeOnBoarding:z.boolean()
})

export type authResType = z.infer<typeof authResSchema>

export type GetMeServiceResponse = {
  data: IUser;
  source: "redis" | "db";
} | null;