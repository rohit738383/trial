import { verifyJWT } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";    


const updateSchema = z.object({
    status: z.enum(["PENDING", "IN_PROGRESS", "RESOLVED"]),
  });

// @ts-expect-error: explanation of why this is needed
export async function PUT(req: NextRequest, { params } : { params :{ id : string}}) {
   try {

     const token = req.cookies.get("accessToken")?.value
 
     if(!token){
         return NextResponse.json({
             success : false,
             message : "Unauthorized"
         }, {status: 401})
     }
 
     const user = await verifyJWT(token)
 
     if(!user || user.role !== "ADMIN"){
         return NextResponse.json({
             success : false,
             message : "Forbidden"
         },
        {status : 403}
     )
     }
 
     const {status} = updateSchema.parse(await req.json())
 
     const id = params.id.replace(/[{}]/g, "");
 
      const inquiry = await prisma.inquiry.update({
         where : {id},
         data : {status}
     })
 
     return NextResponse.json({
         success : true,
         message : "Inquiry updated successfully",
         data : inquiry
     }, {status : 200})
   } catch (error) {
      console.error(error);
      return NextResponse.json({
        success: false,
        message: "An error occurred",
        error: error instanceof Error ? error.message : String(error)
     }, { status: 500 });
   }
}
