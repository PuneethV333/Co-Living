import { api } from "../config/api.config";
import { userUpdateSchema, type userUpdateType } from "../types/user.types";

export const updateUserDataApi = async (data: userUpdateType) => {
    const res = await api.post("/api/user/update", data)
    return userUpdateSchema.parse(res.data.data)
}