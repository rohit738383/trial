import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

// Define the type for the Cloudinary upload result
interface CloudinaryUploadResult {
  secure_url: string;
  [key: string]: unknown;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File
    if (!file) {
      return NextResponse.json({ success: false, message: "No image file provided" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploaded = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "blogs" }, (err, res) => {
        if (err) reject(err)
        else resolve(res as CloudinaryUploadResult)
      }).end(buffer)
    })

    return NextResponse.json({ success: true, imageUrl: uploaded.secure_url })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Image upload failed", error: error?.toString() }, { status: 500 })
  }
} 