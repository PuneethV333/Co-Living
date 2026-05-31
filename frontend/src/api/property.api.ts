import { api } from "../config/api.config"
import { getPropertySchema, type getPropertyType } from "../types/property.types"

export const getPropertyApi = async (): Promise<getPropertyType> => {
    const res = await api.get("/api/property/get")
    return getPropertySchema.parse(res.data.data)
}