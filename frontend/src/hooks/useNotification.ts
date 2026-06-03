import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotificationApi, getAllNotificationApi, getNewNotificationApi, getNotRepliedNotificationApi, replyToNotificationApi } from "../api/notification.api";
import type { createNotificationType, notificationType, replyToMessageType } from "../types/notification.types";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Auth } from "../config/firebase.config";

export const useGetNewNotifications = () => {
    const [uid, setUid] = useState<string | null>(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            setUid(user?.uid ?? null);
            setAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    const queryClient = useQueryClient()
    const query = useQuery({
        queryKey: ["new-notification"],
        queryFn: getNewNotificationApi,
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        retry: 1,
        enabled: authReady && !!uid,
    });

    useEffect(() => {
        if (!query.data?.length) return;

        const hasActionableNotification = query.data.some(
            (notification) => notification.requiresAction
        );

        if (hasActionableNotification) {
            queryClient.invalidateQueries({
                queryKey: ["not-replied-notification"]
            })
        }

    }, [query.data, queryClient])

    return query
}

export const useGetAllNotifications = () =>
    useQuery({
        queryKey: ["notifications"],
        queryFn: getAllNotificationApi,
        retry: 1
    });

export const useGetNotRepliedNotifications = () =>
    useQuery({
        queryKey: ["not-replied-notifications"],
        queryFn: getNotRepliedNotificationApi,
        retry: 1
    });

export const useCreateNotification = () => {
    return useMutation({
        mutationFn: (data: createNotificationType) => createNotificationApi(data),
        mutationKey: ["create-notification"],
        onSuccess: () => {
            toast.success("request has been send")
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })
}

export const useReplyNotification = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["reply-notification"],

        mutationFn: (data: replyToMessageType) =>
            replyToNotificationApi(data),

        onMutate: async (variables) => {
            await queryClient.cancelQueries({
                queryKey: ["not-replied-notifications"],
            });

            const previousNotifications =
                queryClient.getQueryData<notificationType[]>([
                    "not-replied-notifications",
                ]);

            queryClient.setQueryData<notificationType[]>(
                ["not-replied-notifications"],
                (old) =>
                    (old ?? []).filter(
                        (notification) =>
                            notification._id !== variables.messageId
                    )
            );

            return { previousNotifications };
        },

        onError: (err, _, context) => {
            if (context?.previousNotifications) {
                queryClient.setQueryData(
                    ["not-replied-notifications"],
                    context.previousNotifications
                );
            }

            toast.error(err.message);
        },

        onSuccess: () => {
            toast.success("Reply sent");
        },

        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: ["not-replied-notifications"],
            });
        },
    });
};