declare global {
    namespace Express {
        interface Request {
            user?:{
                firebaseUid:string,
                role:"Tenant"| "Owner"| "Admin"
            }
        }
    }
}

export {}