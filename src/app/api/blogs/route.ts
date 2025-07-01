import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"
import { blogSchema } from "@/schemas/blogSchema"
import slugify from "slugify"
import type { UploadApiResponse } from "cloudinary"

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  const user = await verifyJWT(token)
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
  }

  const formData = await req.formData()
  const file = formData.get("image") as File
  const title = formData.get("title")?.toString() || ""
  const content = formData.get("content")?.toString() || ""

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const uploaded = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "blogs" }, (err, res) => {
      if (err) reject(err)
      else resolve(res as UploadApiResponse)
    }).end(buffer)
  })

  const imageUrl = uploaded.secure_url
  const slug = slugify(title, { lower: true, strict: true })

  const parsed = blogSchema.safeParse({ title, content, imageUrl })
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Invalid input", errors: parsed.error.errors }, { status: 400 })
  }

  // Check for existing slug
  const existing = await prisma.blog.findUnique({ where: { slug } })
  if (existing) {
    return NextResponse.json({ success: false, message: "Slug already exists" }, { status: 409 })
  }

  const blog = await prisma.blog.create({
    data: {
      title,
      content,
      imageUrl,
      slug,
    },
  })

  return NextResponse.json(blog)
}


export async function GET() {
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(blogs)
}
