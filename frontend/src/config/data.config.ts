import type { EnvConfigType } from "../types/data.types";

export const config: EnvConfigType = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,

    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,

    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,

    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,

    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,

    appId: import.meta.env.VITE_FIREBASE_APP_ID,

    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  },
  backend_url: import.meta.env.VITE_BACKEND_URL,

  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,

  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
};
