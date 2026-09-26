import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserPriorityApi, getRoomMatePreferenceApi, getUserPropertyPriorityApi, updateUserPropertyPriorityApi } from "../api/propertyPriority.api";
import { Auth } from "../config/firebase.config";
import type { createUserPropertyPreferencePayloadType } from "../types/userPriority.types";
import toast from "react-hot-toast";

export const useGetUserPropertyPriority = () =>
    useQuery({
        queryKey: ["userPropertyPriority"],
        queryFn: getUserPropertyPriorityApi,
        enabled: !!Auth.currentUser
    })
    
export const useGetRoomMatePreference = () =>
    useQuery({
        queryKey: ["roomMate","userPropertyPriority"],
        queryFn: getRoomMatePreferenceApi,
        enabled: !!Auth.currentUser
    })

export const useCreateUserPropertyPriority = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["create", "userPropertyPriority"],
        mutationFn: (data: createUserPropertyPreferencePayloadType) => createUserPriorityApi(data),
        onSuccess: (res) => {
            queryClient.setQueryData(["userPropertyPriority"], res)
            queryClient.invalidateQueries({
                queryKey: ["roomMate", "userPropertyPriority"],
            })
            toast.success("created User Priority")
        }, onError: (err: Error) => {
            toast.error(err.message)
        }
    })
}

export const useUpdateUserPropertyPriority = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationKey: ["update", "userPropertyPriority"],
        mutationFn: (data: createUserPropertyPreferencePayloadType) => updateUserPropertyPriorityApi(data),
        onSuccess: (res) => {
            queryClient.setQueryData(["userPropertyPriority"], res)
            queryClient.invalidateQueries({
                queryKey: ["roomMate", "userPropertyPriority"],
            })
            toast.success("updated User Priority")
        }, onError: (err: Error) => {
            toast.error(err.message)
        }
    })
}