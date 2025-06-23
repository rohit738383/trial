import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/schemas/inquirySchema";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const result = inquirySchema.safeParse(body);
        

        if(!result.success) {
            return NextResponse.json({
                success: false,
                message: "Invalid request body"
            }, {status: 400})
        }

        const data = result.data;

        const inquiry = await prisma.inquiry.create({
            data,
        })

        return NextResponse.json({
            success: true,
            message: "Inquiry created successfully",
            data: inquiry
        }, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, {status: 500})
    }
}


export async function GET(){
    try {
        const inquiries = await prisma.inquiry.findMany({
            orderBy : {
                createdAt : "desc"
            }
        })

        return NextResponse.json(inquiries);
    }

    catch(error){
        console.error(error);
        return NextResponse.json({
            success : false,
            message : "Internal server error"
        }, {status : 500})
    }
}