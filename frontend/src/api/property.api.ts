import { api } from "../config/api.config";
import {
    propertiesResponseSchema,
    propertySchema,
    roomsResponseSchema,
    type PropertiesResponse,
    type PropertyType,
    type RoomsResponse,
} from "../types/property.types";

export const getPropertiesApi = async (): Promise<PropertiesResponse> => {
    const res = await api.get("/api/property/get");
    return propertiesResponseSchema.parse(res.data);
};

export const getPropertiesDetailsApi = async (id: string): Promise<PropertyType> => {
    const res = await api.get(`/api/property/details/${id}`);
    return propertySchema.parse(res.data.data);
};

export const getRoomsApi = async (): Promise<RoomsResponse> => {
    const res = await api.get("/api/room/get");
    return roomsResponseSchema.parse(res.data);
};