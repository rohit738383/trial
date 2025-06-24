import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";
import { z } from "zod";
import { SeminarStatus } from "@prisma/client"; // 👈 your enum

const updateSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PUT = async (req: NextRequest, { params }: any) => {

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

    const seminar = await prisma.seminar.update({
      where: { id: params.id },
      data: {
        status: SeminarStatus[status as keyof typeof SeminarStatus], // 👈 correct type conversion
      },
    });

    return NextResponse.json({
      success: true,
      message: "Seminar updated successfully",
      data: seminar,
    });
  } catch (error) {
    console.error("Seminar Update Error:", error);
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
