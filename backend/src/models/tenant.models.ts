import { model, Model, models, Schema } from "mongoose";
import { ITenantData } from "../types/user/tenantData.types";

const tenantSchema = new Schema<ITenantData>({
    occupationStatus:{
        type:String,
        enum:["student","working-professional","other"],
        required:true
    },income:{
        type:Number,
    }
})

export const Tenant:Model<ITenantData> = models.Tenant || model<ITenantData>("Tenant",tenantSchema,"tenant")