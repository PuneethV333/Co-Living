import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Auth } from "../config/firebase.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { userUpdateType } from "../types/user.types";
import { getSavedPropertyApi, toggleSavePropertyApi, updateUserDataApi } from "../api/user.api";
import toast from "react-hot-toast";
import type { UserType } from "../types/auth.types";

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(Auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return {
        user,
        loading,
    };
};

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: userUpdateType) => updateUserDataApi(data),
        mutationKey: ["update-user"],
        onSuccess: (res) => {
            queryClient.setQueryData(["me"], (old: UserType | undefined) => {
                if (!old) return old;
                return { ...old, ...res };
            });
            toast.success("Updated user");
        },
        onError: () => {
            toast.error("Failed to update user");
        },
    });
};

export const useGetSavedProperty = () =>
    useQuery({
        queryKey: ["saved", "property"],
        queryFn: getSavedPropertyApi,
        enabled: !!Auth.currentUser
    })

export const useToggleSaveProperty = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (propertyId: string) => toggleSavePropertyApi(propertyId),
        mutationKey: ["toggle", "save"],
        onSuccess: (res) => {
            queryClient.setQueryData(["saved", "property"], res)
        }
    })
}