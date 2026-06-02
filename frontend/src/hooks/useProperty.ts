import { useQuery } from "@tanstack/react-query";
import { getPropertiesApi, getPropertiesDetailsApi, getRoomsApi } from "../api/property.api";

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