import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { Auth } from "../config/firebase.config";

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