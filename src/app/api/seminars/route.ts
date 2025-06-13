import { NextRequest, NextResponse } from "next/server";
import { seminarSchema } from "@/schemas/seminarSchema";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";

export async function POST(req : NextRequest) {
    const token = req.cookies.get("token")?.value

    if(!token){
        return NextResponse.json({
            success: false,
            message : "Unauthorized"
        },
        {status: 401}
    )
    }

    const user = await verifyJWT(token);
     if(user.role !== "ADMIN"){
        return NextResponse.json({
            success : false,
            message : "Forbidden"
        },
        {status: 403}
    )
     }

     const body = await req.json();
     const parsed = seminarSchema.safeParse(body);

     if(!parsed.success){
        return NextResponse.json({
            success : false,
            message : "Invalid Input",
            errors: parsed.error.errors,
        },
        {status: 400}
    )
     }

  const seminar =  await prisma.seminar.create({
          data : {
            title : body.title,
            description : body.description,
            date : body.date,
            location : body.location
          },
     })
         return NextResponse.json(seminar);
}

export async function GET(req : NextRequest){
    const seminars = await prisma.seminar.findMany({
        orderBy : {
            date : "asc"
        }
    })

    return NextResponse.json(seminars);
}