declare global {
    namespace Express {
        interface Request {
            user?:{
                firebaseUid:string,
                role:"tenant"| "owner"| "admin"
            }
        }
    }
}

export {}