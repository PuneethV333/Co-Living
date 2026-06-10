import { api } from "../config/api.config";
import { roomSchema, roomsResponseSchema, type createRoomType, type RoomsResponse, type RoomType } from "../types/property.types";

export const getRoomsApi = async (): Promise<RoomsResponse> => {
    const res = await api.get("/api/room/get");
    return roomsResponseSchema.parse(res.data);
};

export const createRoomApi = async (data: createRoomType): Promise<RoomType> => {
    const res = await api.post("/api/room/create",data)
    return roomSchema.parse(res.data.data)
}