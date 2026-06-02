import { useQuery } from "@tanstack/react-query";
import { getAllNotificationApi, getNewNotificationApi } from "../api/notification.api";

export const useGetNewNotifications = () => 
    useQuery({
        queryKey:["new-notification"],
        queryFn:getNewNotificationApi,
        refetchInterval:10000,
        retry:false
    });
    
    
export const useGetAllNotifications = () =>
    useQuery({
        queryKey: ["notifications"],
        queryFn: getAllNotificationApi,
        retry:false
        });