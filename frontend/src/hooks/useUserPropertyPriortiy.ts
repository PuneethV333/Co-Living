import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUserPriorityApi, getUserPropertyPriorityApi, updateUserPropertyPriorityApi } from "../api/propertyPriority.api";
import { Auth } from "../config/firebase.config";
import type { createUserPropertyPreferencePayloadType } from "../types/userPriority.types";
import toast from "react-hot-toast";

export const useGetUserPropertyPriority = () =>
    useQuery({
        queryKey: ["userPropertyPriority"],
        queryFn: getUserPropertyPriorityApi,
        enabled: !!Auth.currentUser
    })

export const useCreateUserPropertyPriority = () => {
    return useMutation({
        mutationKey: ["create", "userPropertyPriority"],
        mutationFn: (data: createUserPropertyPreferencePayloadType) => createUserPriorityApi(data),
        onSuccess: () => {
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
            toast.success("created User Priority")
        }, onError: (err: Error) => {
            toast.error(err.message)
        }
    })
}