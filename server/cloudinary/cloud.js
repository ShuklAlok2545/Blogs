import { v2 as cloudinary } from "cloudinary";
import multer from 'multer'

import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})

export const upload = multer({dest:'uploads/'});
export  {cloudinary}

