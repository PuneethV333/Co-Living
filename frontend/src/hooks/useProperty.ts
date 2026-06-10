import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPropertyApi, getPropertiesApi, getPropertiesDetailsApi, searchForPropertyApi } from "../api/property.api";
import { createRoomApi, getRoomsApi } from "../api/room.api";
import type { createPropertyType, createRoomType, PropertyType } from "../types/property.types";
import toast from "react-hot-toast";

export const useGetProperties = () =>
    useQuery({
        queryKey: ["properties"],
        queryFn: getPropertiesApi,
        select: (res) => res.data,
    });

export const useGetRooms = () =>
    useQuery({
        queryKey: ["rooms"],
        queryFn: getRoomsApi,
        select: (res) => res.data,
    });

export const useGetPropertyDetails = (id: string) =>
    useQuery({
        queryKey: ["property", id],
        queryFn: () => getPropertiesDetailsApi(id),
        enabled: !!id,
    });

export const useCreateProperty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: createPropertyType) => createPropertyApi(data),
        mutationKey: ["create-property"],
        onSuccess: (res) => {
            queryClient.setQueryData(["properties"], (oldData: PropertyType[] = []) => [res, ...oldData])
            toast.success("Created new Property")
        },
        onError: (err) => {
            toast.error(err.message)
        }
    })
}

export const useSearchProperties = () => {
    return useMutation({
        mutationFn: (search: string) => searchForPropertyApi(search),
        mutationKey: ["search"],
    })
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["create", "room"],

        mutationFn: (data: createRoomType) => createRoomApi(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["rooms"],
            });

            queryClient.invalidateQueries({
                queryKey: ["properties"],
            });
        },

        onError: (error) => {
            console.error("Failed to create room:", error);
        },
    });
};