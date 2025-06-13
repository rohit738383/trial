import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { usernameValidation } from "@/schemas/signUpSchema";
 
const UsernameQuerySchema = z.object({
     username : usernameValidation,
});

export async function GET(request : Request){
  
    try {
        
        const {searchParams} = new URL(request.url);

        const queryParams = {
            username : searchParams.get("username"),
        }

        const result = UsernameQuerySchema.safeParse(queryParams);
        

        if(!result.success){

             const usernameErrors = result.error.format().username?._errors || [];
             return NextResponse.json({
                success : false,
                message :   usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
             },
            {status : 400}
            )
        }

        const {username} = result.data;

        const existingVerifedUsername = await prisma.user.findFirst({where :{
            username , 
            isVerified : true,
        }});

        if(existingVerifedUsername){
            return NextResponse.json(
                {
                    success : false,
                    message : "Username already taken"
                },
                {status : 200},
            )
        }

       return NextResponse.json(
      {
        success: true,
        message: 'Username is unique',
      },
      { status: 200 }
    );


    } catch (error) {
       
        return  NextResponse.json({
            success : false,
            message : "Error checking username",
        },
        {status : 500}
    )
    }
}