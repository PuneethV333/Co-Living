import { useMutation, useQuery } from "@tanstack/react-query";
import { createNotificationApi, getAllNotificationApi, getNewNotificationApi } from "../api/notification.api";
import type { createNotificationType } from "../types/notification.types";
import toast from "react-hot-toast";

export const useGetNewNotifications = () =>
    useQuery({
        queryKey: ["new-notification"],
        queryFn: getNewNotificationApi,
        refetchInterval: 10000,
        refetchIntervalInBackground: false,
        retry: 1,
    });


export const useGetAllNotifications = () =>
    useQuery({
        queryKey: ["notifications"],
        queryFn: getAllNotificationApi,
        retry: 1
    });

export const useCreateNotification = () => {
    return useMutation({
        mutationFn: (data: createNotificationType) => createNotificationApi(data),
        mutationKey: ["create-notification"],
        onSuccess:() => {
            toast.success("request has been send")
        },
        onError:(err) => {
            toast.error(err.message)
        }
    })
}
