import admin from "firebase-admin"
import { config } from "./data.config"

if(!admin.app.length){
    admin.initializeApp({
        credential:admin.credential.cert({
            projectId:config.firebaseProjectId,
            privateKey:config.firebasePrivateKey,
            clientEmail:config.firebaseClientEmail
        })
    })
    console.log("✅ Firebase Admin initialized successfully");
}

export default admin