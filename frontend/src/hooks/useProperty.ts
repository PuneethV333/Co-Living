import { useQuery } from "@tanstack/react-query";
import { getPropertyApi } from "../api/property.api";

export const useGetPropertyData = () => 
    useQuery({
        queryKey:["property"],
        queryFn:getPropertyApi,
    })