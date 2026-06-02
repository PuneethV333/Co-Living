import { api } from "../config/api.config"
import { notificationsSchema, type createNotificationType, type notificationsType } from "../types/notification.types"

export const getNewNotificationApi = async (): Promise<notificationsType> => {
    const res = await api.get("/api/notification/get/new")
    return notificationsSchema.parse(res.data.data)
}

export const getAllNotificationApi = async (): Promise<notificationsType> => {
    const res = await api.get("/api/notification/get/all")
    return notificationsSchema.parse(res.data.data)
}

export const createNotificationApi = async (data: createNotificationType): Promise<boolean> => {
    const res = await api.post("/api/notification/create", data)
    return res.data.success
}
