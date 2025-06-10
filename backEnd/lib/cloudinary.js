
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUND_NAME,
    api_key:process.env.CLOUDINARY_CLOUND_KEY,
    api_secret:process.env.CLOUDINARY_CLOUND_SECRET,
});

export default cloudinary;