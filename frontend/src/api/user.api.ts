import { api } from "../config/api.config";
import { propertySchema, type propertySchemaType } from "../types/property.types";
import { userUpdateSchema, type userUpdateType } from "../types/user.types";

export const updateUserDataApi = async (data: userUpdateType) => {
    const res = await api.post("/api/user/update", data)
    return userUpdateSchema.parse(res.data.data)
}

export const getSavedPropertyApi = async (): Promise<propertySchemaType[]> => {
    const res = await api.get("/api/user/saved/property")
    return propertySchema.array().parse(res.data.data)
}