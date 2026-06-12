import { Resend } from "resend";
import { config } from "./data.config";

export const resendConfig = new Resend(config.resendApiKey)