import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: Buffer | string, folder: string = "cineverse") {
  try {
    if (Buffer.isBuffer(file)) {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(file);
      });
    } else {
      return await cloudinary.uploader.upload(file, { folder });
    }
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}

export default cloudinary;
