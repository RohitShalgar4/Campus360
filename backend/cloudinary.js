import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (buffer, mimeType) => {
  try {
    // Convert buffer to base64
    const base64String = buffer.toString('base64');
    const uploadStr = `data:${mimeType};base64,${base64String}`;

    const uploadResponse = await cloudinary.uploader.upload(uploadStr, {
      resource_type: mimeType === 'application/pdf' ? 'raw' : 'image',
      folder: "campus360/budgets",
      allowed_formats: mimeType === 'application/pdf' ? ['pdf'] : ['jpg', 'jpeg', 'png'],
      transformation: mimeType === 'application/pdf' ? [] : [
        { quality: "auto:good" },
        { fetch_format: "auto" }
      ]
    });
    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload file to Cloudinary");
  }
};

export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error("Failed to delete file from Cloudinary");
  }
};