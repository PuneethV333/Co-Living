import { z } from "zod";

const firebaseSchema = z.object({
  apiKey: z.string().min(1),

  authDomain: z.string().min(1),

  projectId: z.string().min(1),

  storageBucket: z.string().min(1),

  messagingSenderId: z.string().min(1),

  appId: z.string().min(1),

  measurementId: z.string().optional(),
});

export const envConfigSchema = z.object({
  firebase: firebaseSchema,
  backend_url: z.url(),
  cloudName: z.string(),
  uploadPreset: z.string(),
});

export type EnvConfigType = z.infer<typeof envConfigSchema>;