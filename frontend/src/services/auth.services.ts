import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Auth, googleAuthProvider } from "../config/firebase.config";
import type { SignInViaEmailType, SignUpViaEmailType } from "../types/auth.types";

export const signInViaEmail = async (payload: SignInViaEmailType) => {
  const credential = await signInWithEmailAndPassword(
    Auth,
    payload.email,
    payload.password,
  );

  return credential.user;
};

export const signUpViaEmail = async (payload: SignUpViaEmailType) => {
  const credential = await createUserWithEmailAndPassword(
    Auth,
    payload.email,
    payload.password,
  );

  return credential.user;
};

export const signInViaGoogle = async () => {
    const credential = await signInWithPopup(Auth,googleAuthProvider)
    
    return credential.user
}