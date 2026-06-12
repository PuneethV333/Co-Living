import nodemailer from "nodemailer";
import { config } from "./data.config";

export const nodeMailer = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:config.email,
        pass:config.pass
    }
})