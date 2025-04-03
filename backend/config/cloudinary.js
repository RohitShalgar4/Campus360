import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    if (!file || !file.buffer || !file.mimetype) {
      throw new Error("Invalid file object: Missing required properties");
    }

    // Log file details for debugging
    console.log("File details:", {
      mimetype: file.mimetype,
      size: file.size,
      originalname: file.originalname,
    });

    // Convert buffer to base64
    const base64Data = file.buffer.toString("base64");
    const uploadStr = `data:${file.mimetype};base64,${base64Data}`;

    // Determine resource type based on file type
    const isPDF = file.mimetype === "application/pdf";
    const resourceType = isPDF ? "raw" : "auto";

    // Set allowed formats based on file type
    const allowedFormats = isPDF ? ["pdf"] : ["jpg", "jpeg", "png"];

    console.log("Uploading to Cloudinary with config:", {
      resourceType,
      allowedFormats,
      folder: "budget_receipts",
    });

    const result = await cloudinary.uploader.upload(uploadStr, {
      resource_type: resourceType,
      allowed_formats: allowedFormats,
      folder: "budget_receipts",
      transformation: isPDF
        ? []
        : [{ quality: "auto" }, { fetch_format: "auto" }],
      // Add these options for PDFs
      ...(isPDF && {
        format: "pdf",
        resource_type: "raw",
        type: "private",
        flags: "attachment",
      }),
    });

    if (!result || !result.secure_url || !result.public_id) {
      throw new Error("Invalid response from Cloudinary");
    }

    // Generate a signed URL for PDFs to ensure proper access
    let finalUrl = result.secure_url;
    if (isPDF) {
      finalUrl = cloudinary.url(result.public_id, {
        resource_type: "raw",
        type: "private",
        sign_url: true,
        secure: true,
        flags: "attachment",
      });
    } else {
      // For images, ensure we have a proper URL
      finalUrl = cloudinary.url(result.public_id, {
        secure: true,
        quality: "auto",
        fetch_format: "auto",
      });
    }

    console.log("Cloudinary upload successful:", {
      url: finalUrl,
      publicId: result.public_id,
    });

    return {
      url: finalUrl,
      publicId: result.public_id,
      format: isPDF ? "pdf" : "image",
    };
  } catch (error) {
    console.error("Cloudinary upload error:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    throw new Error(`Error uploading file to Cloudinary: ${error.message}`);
  }
};

export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`Error deleting file from Cloudinary: ${error.message}`);
  }
};
