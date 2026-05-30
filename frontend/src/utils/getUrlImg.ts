import axios from "axios";
import { config } from "../config/data.config";

export const getImgUrl = async (file:File) :Promise<string>=> {
    const cloudinary_url = `https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`

    const data = new FormData()
    data.append("file",file)
    data.append('upload_preset', config.uploadPreset)
    
    const res = await axios.post(cloudinary_url, data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data?.secure_url;
}