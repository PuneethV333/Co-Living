import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Auth, googleAuthProvider } from "../config/firebase.config";
import type {
  SignInViaEmailType,
  SignUpViaEmailType,
} from "../types/auth.types";

export const signInViaEmail = async (payload: SignInViaEmailType) => {
  await signOut(Auth);
  const credential = await signInWithEmailAndPassword(
    Auth,
    payload.email,
    payload.password,
  );

  return credential.user;
};

export const signUpViaEmail = async (payload: SignUpViaEmailType) => {
  await signOut(Auth);
  const credential = await createUserWithEmailAndPassword(
    Auth,
    payload.email,
    payload.password,
  );

  return credential.user;
};

export const signInViaGoogle = async () => {
  await signOut(Auth);
  const credential = await signInWithPopup(Auth, googleAuthProvider);

  return credential.user;
};
