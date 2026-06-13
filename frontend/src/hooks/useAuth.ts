import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    authApi,
    completeOnBoardingApi,
    getMeApi,
    sendOtpApi,
    sendOtpViaEmailApi,
    verifyOtpApi,
    verifyOtpViaEmailApi,
} from "../api/auth.api";
import { useNavigate } from "react-router-dom";
import { Auth } from "../config/firebase.config";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: authApi,
        mutationKey: ["auth"],
        onSuccess: (res) => {
            queryClient.setQueryData(["authReady"], true);

            if (res?.data?.completeOnBoarding) {
                navigate("/home", { replace: true });
            } else {
                navigate("/on-boarding", { replace: true });
            }
        },
    });
};

export const useGetMe = () => {
    
    const [uid, setUid] = useState<string | null>(null);
    const [authReady, setAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            setUid(user?.uid ?? null);
            setAuthReady(true);
        });
        return () => unsubscribe();
    }, []);


    return useQuery({
        queryKey: ["me"],
        queryFn: getMeApi,
        enabled: authReady && !!uid ,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });
};

export const useCompleteOnBoarding = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: completeOnBoardingApi,
        mutationKey: ["on-boarding"],
        onSuccess: (res) => {
            queryClient.setQueryData(["me"], res);
            toast.success("completed on-boarding");
            navigate("/home", { replace: true });
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
};

export const useSendOtp = () => {
    return useMutation({
        mutationFn: sendOtpApi,
        mutationKey: ["otp"],
    });
};

export const useVerifyOtp = () => {
    return useMutation({
        mutationFn: verifyOtpApi,
        mutationKey: ["otp", "verify"],
    });
};

export const useSendViaEmailOtp = () => {
    return useMutation({
        mutationFn: sendOtpViaEmailApi,
        mutationKey: ["otp"],
    });
};

export const useVerifyViaEmailOtp = () => {
    return useMutation({
        mutationFn: verifyOtpViaEmailApi,
        mutationKey: ["otp", "verify"],
    });
};
