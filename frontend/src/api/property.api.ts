import { api } from "../config/api.config";
import {
  propertiesResponseSchema,
  roomsResponseSchema,
  type PropertiesResponse,
  type RoomsResponse,
} from "../types/property.types";

export const getPropertiesApi = async (): Promise<PropertiesResponse> => {
  const res = await api.get("/api/property/get");
  return propertiesResponseSchema.parse(res.data);
};

export const getRoomsApi = async (): Promise<RoomsResponse> => {
  const res = await api.get("/api/room/get");
  return roomsResponseSchema.parse(res.data);
};