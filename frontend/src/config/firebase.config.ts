import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { config } from "./data.config";

const firebaseConfig = {
  apiKey: config.firebase.apiKey,

  authDomain: config.firebase.authDomain,

  projectId: config.firebase.projectId,

  storageBucket: config.firebase.storageBucket,

  messagingSenderId: config.firebase.messagingSenderId,

  appId: config.firebase.appId,

  measurementId: config.firebase.measurementId,
};

export const app = initializeApp(firebaseConfig);
export const Auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
