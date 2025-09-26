import { v2 as cloudinary } from "cloudinary";
import config from "../config";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { Request } from "express";

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Configure Cloudinary Storage for Files (Images and PDFs)
const fileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const timestamp = Date.now();
    const fileName = file.originalname.split(".")[0];

    return {
      folder: "E-learning", // Cloudinary folder for files
      public_id: `${fileName}-${timestamp}`,
      resource_type: file.mimetype.startsWith("image/") ? "image" : "auto", // Auto detect file type
    };
  },
});

// Multer Configuration for File Uploads (Allow multiple images and PDFs)
const uploadFiles = multer({
  storage: fileStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    const allowedTypes = /^(image\/(jpeg|png|jpg))|(application\/pdf)$/; // Allow images and PDFs
    if (!allowedTypes.test(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG, and PDF files are allowed"));
    }
    return cb(null, true);
  },
});

// Export the Multer Middleware
export const uploadToCloudinaryFiles = uploadFiles.fields([
  { name: "thumbnail", maxCount: 5 }, // Allow up to 5 thumbnails
  { name: "receipt", maxCount: 5 }, // Allow up to 5 receipts
]);

export const uploadToCloudinaryProfileImage = uploadFiles.single("profileImage");

export default cloudinary;