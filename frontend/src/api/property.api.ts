import { api } from "../config/api.config";
import {
    propertiesResponseSchema,
    propertySchema,
    type createPropertyType,
    type PropertiesResponse,
    type PropertyType,
} from "../types/property.types";

export const getPropertiesApi = async (): Promise<PropertiesResponse> => {
    const res = await api.get("/api/property/get");
    console.log(res);
    
    return propertiesResponseSchema.parse(res.data);
};

export const getPropertiesDetailsApi = async (id: string): Promise<PropertyType> => {
    const res = await api.get(`/api/property/details/${id}`);
    return propertySchema.parse(res.data.data);
};

export const createPropertyApi = async (data: createPropertyType): Promise<PropertyType> => {
    const res = await api.post("/api/property/create", data);
    return propertySchema.parse(res.data.data);
}

export const searchForPropertyApi = async (search:string):Promise<PropertiesResponse> => {
    const res = await api.post("/api/property/search",search);
    return propertiesResponseSchema.parse(res.data)
}