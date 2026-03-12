import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import connectDB from "@/lib/db";
import Media from "@/models/Media";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

cloudinary.config({
  cloud_name:
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const url = formData.get("url") as string | null;

    if (!file && !url) {
      return NextResponse.json(
        { success: false, error: "No file or URL provided" },
        { status: 400 },
      );
    }

    await connectDB();
    let result;

    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "cineverse" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });
    } else if (url) {
      result = await cloudinary.uploader.upload(url, { folder: "cineverse" });
    }

    const uploadedMedia = result as any;

    const newMedia = await Media.create({
      url: uploadedMedia.secure_url,
      name: file ? file.name : url?.split("/").pop() || "upload.jpg",
      size: uploadedMedia.bytes,
      publicId: uploadedMedia.public_id,
      format: uploadedMedia.format,
    });

    return NextResponse.json({ success: true, media: newMedia });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Upload failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const items = await Media.find().sort({ createdAt: -1 });

    // transform to match frontend format
    const formatted = items.map((m) => ({
      _id: m._id,
      url: m.url,
      name: m.name,
      size:
        m.size > 1024 * 1024
          ? (m.size / (1024 * 1024)).toFixed(2) + " MB"
          : Math.round(m.size / 1024) + " KB",
      uploadedAt: m.createdAt.toISOString().split("T")[0],
      publicId: m.publicId,
    }));

    return NextResponse.json({ success: true, media: formatted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await req.json();
    await connectDB();
    const media = await Media.findById(id);
    if (!media)
      return NextResponse.json(
        { success: false, error: "Media not found" },
        { status: 404 },
      );

    await cloudinary.uploader.destroy(media.publicId);
    await Media.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
