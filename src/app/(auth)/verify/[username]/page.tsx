"use client"

import axios from "axios";
import { verifySchema } from "@/schemas/verifySchema";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import axiosInstance from "@/lib/axiosInstance"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"


const VerifyOtp = () =>{

    const router = useRouter();
    const params = useParams<{username: string}>()

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
   
    try {
            const response = await axiosInstance.post("/api/auth/verify-otp", {
                      username: params.username,
                      verifyCode: data.code
                  },
                  {
                    withCredentials: true 
                  }
                );
                   console.log(response)
                  toast.success("verified successfully",{
                      description: response.data.message,
                  })
                
                  router.replace('/');
      
               } catch (error) {
                const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Something went wrong" : "Verify code error";
                  toast.error("Invalid OTP",{
                      description : errorMessage,
                  })
               }

  }

      const handleResendOtp = async () => {
      try {
        const response = await axiosInstance.post("/api/auth/resend-otp", {
          username: params.username,
        });
    
        toast.success("OTP Resent", {
          description: response.data.message,
        });
      } catch (error: unknown) {
        const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Something went wrong" : "Resend code error";
        toast.error("Failed to resend OTP", {
          description: errorMessage,
        });
      }
    };

  return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Verify Your Account
        </h1>
        <p className="mb-4">Enter the verification code sent to your email</p>
      </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the one-time password sent to your phone.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Verify</Button>
      </form>
    </Form>

      <div className="text-sm text-center">
  Didn’t get the code?{" "}
  <button
    type="button"
    onClick={handleResendOtp}
    className="text-blue-600 hover:underline"
  >
    Resend OTP
  </button>
</div>

     </div>

   </div>

  )
}

export default VerifyOtp