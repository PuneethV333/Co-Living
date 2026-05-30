import admin from "firebase-admin";
import { config } from "./data.config";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: config.firebaseProjectId,
      clientEmail: config.firebaseClientEmail,
      privateKey: config.firebasePrivateKey.replace(/\\n/g, "\n"),
    }),
  });
  console.log("✅ Firebase Admin initialized successfully");
}

export default admin;