import { api } from "../config/api.config";
import { userPropertyPreferenceSchema, type createUserPropertyPreferencePayloadType, type userPropertyPreferenceType } from "../types/userPriority.types";


export const createUserPriorityApi = async (data: createUserPropertyPreferencePayloadType): Promise<userPropertyPreferenceType> => {
    const res = await api.post("/api/propertyPreference/create", data);
    return userPropertyPreferenceSchema.parse(res.data.data)
}

export const getUserPropertyPriorityApi = async (): Promise<userPropertyPreferenceType> => {
    const res = await api.get("/api/propertyPreference/get");
    return userPropertyPreferenceSchema.parse(res.data.data)
}

export const updateUserPropertyPriorityApi = async (data: createUserPropertyPreferencePayloadType): Promise<userPropertyPreferenceType> => {
    const res = await api.post("/api/propertyPreference/update", data);
    return userPropertyPreferenceSchema.parse(res.data.data)
}

