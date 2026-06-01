import { useQuery } from "@tanstack/react-query";
import { getPropertiesApi, getRoomsApi } from "../api/property.api";

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