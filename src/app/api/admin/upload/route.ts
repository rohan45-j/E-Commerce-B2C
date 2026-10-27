import { NextResponse } from "next/server";
import { getCurrentUser } from "@/server/auth-helpers";
import { Role } from "@prisma/client";
import path from "path";
import fs from "fs/promises";

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/svg+xml",
  "image/x-icon",
  "image/vnd.microsoft.icon",
  "image/gif",
  "application/octet-stream", // sometimes .ico files are sent as octet-stream
]);

const ALLOWED_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".ico",
  ".gif",
]);

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || (user.role !== Role.ADMIN && user.role !== Role.STAFF)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin privileges required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const assetType = ((formData.get("type") as string) || "asset").replace(/[^a-zA-Z0-9_-]/g, "");

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided in form data." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: "File size exceeds the 5MB limit." },
        { status: 400 }
      );
    }

    const originalName = file.name || "upload";
    const ext = path.extname(originalName).toLowerCase();

    if (!ALLOWED_EXTENSIONS.has(ext) && !ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid file format. Only PNG, JPG, WebP, SVG, and ICO files are supported.",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optional Cloudinary Upload if configured in environment
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      try {
        const cloudinary = await import("cloudinary");
        cloudinary.v2.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        const base64Data = buffer.toString("base64");
        const dataUri = `data:${file.type || "image/png"};base64,${base64Data}`;
        const uploadRes = await cloudinary.v2.uploader.upload(dataUri, {
          folder: "fabrilife-store/branding",
          resource_type: ext === ".ico" ? "raw" : "image",
        });

        return NextResponse.json({
          success: true,
          url: uploadRes.secure_url,
          fileName: uploadRes.public_id,
          size: file.size,
        });
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to local filesystem storage:", cloudErr);
      }
    }

    // Local filesystem storage under public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const safeExtension = ext || ".png";
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileName = `${assetType}-${Date.now()}-${randomSuffix}${safeExtension}`;
    const filePath = path.join(uploadsDir, fileName);

    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal upload error.",
      },
      { status: 500 }
    );
  }
}
