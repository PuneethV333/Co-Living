import { api } from "../config/api.config"
import { notificationsSchema, type notificationsType } from "../types/notification.types"

export const getNewNotificationApi = async (): Promise<notificationsType> => {
    const res = await api.get("/api/notification/get/new")
    return notificationsSchema.parse(res.data.data)
}

export const getAllNotificationApi = async (): Promise<notificationsType> => {
    const res = await api.get("/api/notification/get/all")
    return notificationsSchema.parse(res.data.data)
}


