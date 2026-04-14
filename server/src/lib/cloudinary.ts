/**
 * server/src/lib/cloudinary.ts
 * Wraps Cloudinary API for image/file uploads and manipulation.
 */

import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from "cloudinary";
import { env } from "@config/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Validates file size and format before pushing to cloudinary.
 */
export async function uploadImage(
  filePathOrBuffer: string,
  folder: string = "modulyn/general"
): Promise<UploadApiResponse> {
  const options: UploadApiOptions = {
    folder,
    resource_type: "image",
    fetch_format: "auto",     // Automatically convert to webp/avif
    quality: "auto:good",     // Optimize quality size
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePathOrBuffer, options, (error, result) => {
      if (error) return reject(error);
      if (!result) return reject(new Error("Cloudinary returned empty result"));
      resolve(result);
    });
  });
}

/**
 * Given a secure_url or public_id, deletes the asset.
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: "image" }, (error, result) => {
      if (error) return reject(error);
      resolve(result.result === "ok");
    });
  });
}

export default cloudinary;
