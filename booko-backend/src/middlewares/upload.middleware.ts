import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import type { Request } from "express";
import path from "path";
import fs from "fs";
import { HttpError } from "../errors/http-error";

const UPLOAD_DIR = path.join(__dirname, "../../uploads");

// ensure uploads folder exists once (on startup)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },

  filename: (_req, file, cb) => {
    const safeOriginal = file.originalname.replace(/\s+/g, "_");
    cb(null, `${uuidv4()}-${safeOriginal}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  _req: Request,
  file: Express.Multer.File,
  cb
) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
    return;
  }
  cb(new HttpError(400, "Invalid file type. Only images are allowed."));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter,
});

export const uploads = {
  single: (fieldName: string) => upload.single(fieldName),
  array: (fieldName: string, maxCount: number) =>
    upload.array(fieldName, maxCount),
  fields: (fields: { name: string; maxCount?: number }[]) =>
    upload.fields(fields),
};
