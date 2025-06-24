import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
});

// ✅ NO `any`, NO ESLINT ERROR
type Context = {
  params: {
    id: string;
  };
};

// ✅ Arrow function (required for Next.js 15)
export const PUT = async (req: NextRequest, context: Context) => {
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

    const id = context.params.id;

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
    console.error("Update Inquiry Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
};
