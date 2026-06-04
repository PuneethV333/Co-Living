import { api } from "../config/api.config";
import { roomsResponseSchema, type RoomsResponse } from "../types/property.types";

export const getRoomsApi = async (): Promise<RoomsResponse> => {
    const res = await api.get("/api/room/get");
    return roomsResponseSchema.parse(res.data);
};