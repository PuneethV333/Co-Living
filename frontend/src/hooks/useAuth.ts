import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi,getMeApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { Auth } from "../config/firebase.config";

export const useAuth = () => {
    const navigate = useNavigate()
    return useMutation({
        mutationFn:authApi,
        mutationKey:["auth"],
        onSuccess:(res) => {
            if(res?.data?.completeOnBoarding){
                navigate("/home")
            }else{
                navigate("/on-boarding")
            }
        }
    })
}


export const useGetMe = () => 
    useQuery({
        queryKey:["me"],
        queryFn:getMeApi,
        enabled:!!Auth.currentUser?.uid
    })