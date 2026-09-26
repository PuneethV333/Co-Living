import "express-serve-static-core";

declare global {
    namespace Express {
        interface Request {
            user?:{
                firebaseUid:string,
                role?:"Tenant"| "Owner"| "Admin"|undefined,
                email?:string,
                name?:string,
                profilePic?:string
            }
        }
    }
}

export {}