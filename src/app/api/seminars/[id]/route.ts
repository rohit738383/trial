import { NextRequest, NextResponse } from "next/server";
import { seminarSchema } from "@/schemas/seminarSchema";
import { prisma } from "@/lib/prisma";
import { verifyJWT } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function PUT(req : NextRequest , {params} : {params :{id : string}}){
    const token = req.cookies.get("accessToken")?.value

    if(!token){
        return NextResponse.json({
            success : false,
            message : "Unauthorized"
        },
        {status: 401}
    )
    }

    const user = await verifyJWT(token);
    if(!user || user.role !== "ADMIN"){
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
            errors : parsed.error.errors
        },
        {status: 400}
    )
    }

    const id = params.id.replace(/[{}]/g, "");


   const seminar = await prisma.seminar.update({
    where : {id},
    data : {
        title : body.title,
        description : body.description,
        date : new Date(body.date),     
        time : body.time,
        duration : Number(body.duration),
        location : body.location,
        price : new Prisma.Decimal(body.price),
        capacity : Number(body.capacity),
        status : body.status,
    },
   })
  
   return NextResponse.json(seminar);
}


export async function DELETE(req : NextRequest , {params} : {params :{id : string}}){{
   const token = req.cookies.get("accessToken")?.value

   if(!token){
    return NextResponse.json({
        success : false,
        message : "Unauthorized"
    },
    {status: 401}
   )
   }
   
   const user = await verifyJWT(token);
   if(!user || user.role !== "ADMIN"){
    return NextResponse.json({
        success : false,
        message : "Forbidden"
    },
    {status: 403}
   )
   }
   const id = params.id.replace(/[{}]/g, "");

   await prisma.seminar.delete({
    where : {id}
   })

   return NextResponse.json({
    success : true,
   })
}

}