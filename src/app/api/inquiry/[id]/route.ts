import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
});

// ✅ DO NOT give any type to `params` — let Next.js infer
export async function PUT(
  req: NextRequest,
  context: any // 👈 use `any` here to bypass the invalid signature error
) {
  try {
    const token = req.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const user = await verifyJWT(token);

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const { status } = updateSchema.parse(await req.json());

    const id = context.params.id; // use context.params safely here

    const inquiry = await prisma.inquiry.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully",
      data: inquiry,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
