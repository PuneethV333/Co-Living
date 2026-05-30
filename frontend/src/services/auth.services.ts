import {
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  type ConfirmationResult,
} from "firebase/auth";
import { Auth, googleAuthProvider } from "../config/firebase.config";
import type {
  SignInViaEmailType,
  SignUpViaEmailType,
} from "../types/auth.types";

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
  const credential = await signInWithPopup(Auth, googleAuthProvider);

  return credential.user;
};

let recaptchaVerifier: RecaptchaVerifier | null = null;

const getRecaptchaVerifier = () => {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(Auth, "recaptcha-container", {
      size: "invisible",
    });
  }
  return recaptchaVerifier;
};

export const sendOtp = async (
  phoneNumber: string,
): Promise<ConfirmationResult> => {
  const appVerifier = getRecaptchaVerifier();
  const confirmationResult = await signInWithPhoneNumber(
    Auth,
    phoneNumber,
    appVerifier,
  );
  return confirmationResult;
};

export const verifyOtp = async (
  otp: string,
  confirmationResult: ConfirmationResult,
) => {
  const res = await confirmationResult.confirm(otp);
  return res.user;
};

export const clearRecaptcha = () => {
  recaptchaVerifier?.clear();
  recaptchaVerifier = null;
};
