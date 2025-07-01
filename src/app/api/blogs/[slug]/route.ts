import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyJWT } from "@/lib/auth"
import { blogSchema } from "@/schemas/blogSchema"
import slugify from "slugify"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const blog = await prisma.blog.findUnique({
    where: { slug: params.slug },
  })

  if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })

  return NextResponse.json(blog)
}


export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  const user = await verifyJWT(token)
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
  }

  const body = await req.json()
  const parsed = blogSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ success: false, message: "Invalid input", errors: parsed.error.errors }, { status: 400 })
  }

  const blog = await prisma.blog.findUnique({ where: { slug: params.slug } })
  if (!blog) return NextResponse.json({ success: false, message: "Blog not found" }, { status: 404 })

  const updateData: Prisma.BlogUpdateInput = {
    title: body.title,
    content: body.content,
    imageUrl: body.imageUrl,
  }

  if (body.title !== blog.title) {
    updateData.slug = slugify(body.title, { lower: true, strict: true })
  }

  const updated = await prisma.blog.update({
    where: { slug: params.slug },
    data: updateData,
  })

  return NextResponse.json(updated)
}



export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  const token = req.cookies.get("accessToken")?.value
  if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })

  const user = await verifyJWT(token)
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 })
  }

  await prisma.blog.delete({ where: { slug: params.slug } })
  return NextResponse.json({ success: true })
}

  
