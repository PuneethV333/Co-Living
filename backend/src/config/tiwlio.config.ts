import twilio from "twilio"
import { config } from "./data.config"

export const twilioClient = twilio(
    config.accountSid,
    config.authToken,
);

