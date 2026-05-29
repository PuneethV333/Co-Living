import { api } from "../config/api.config";
import { userSchema, type resType } from "../types/auth.types";

export const authApi = async ():Promise<resType> => {
  const res = await api.post<resType>("/api/auth/");
  return res.data;
};

export const getMeApi = async () => {
    const res = await api.get("/api/auth/me")
    return userSchema.parse(res.data.data);
}