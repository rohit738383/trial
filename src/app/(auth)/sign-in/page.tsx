"use client"

import axios from "axios"
import { useState,useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import axiosInstance from '@/lib/axiosInstance'
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuthStore } from "@/stores/useAuthStore";



const SignInPage = () => {

  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)
  const [loginType, setLoginType] = useState<"username" | "phone">("username")


const form = useForm<z.infer<typeof signInSchema>>({
  resolver: zodResolver(signInSchema),
  defaultValues: {
    identifier: "",
    password: "",
  },
})



const onSubmit = async (data: z.infer<typeof signInSchema>) => {


  const payload = {
    ...data,
    identifier: loginType === "phone" ? `+91${data.identifier}` : data.identifier,
  };

  try {
    const response = await axiosInstance.post("/api/sign-in", payload,{
      withCredentials: true 
    })
  

    setUser(response.data.user);
 

    console.log(response)
    toast.success("verified successfully",{
        description: response.data.message,
    })
    

    router.push("/homepage")
    

  } catch (error) {
      const errorMesssage = axios.isAxiosError(error) ? error.response?.data.message || "Something went wrong" : "Login Error"; 
    toast.error("Sigin Failed", {
      description: errorMesssage,  
  })
  }
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Studytainment
        </h1>
        <p className="mb-4">Let's get you started</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
         
        <FormField
  name="identifier"
  control={form.control}
  render={({ field }) => (
    <FormItem>
      <FormLabel>{loginType === "phone" ? "Phone Number" : "Username"}</FormLabel>
      {loginType === "phone" ? (
        <div className="flex items-center space-x-2">
          <span className="px-3 py-2 bg-gray-100 border rounded text-gray-600 text-sm">+91</span>
          <Input
            {...field}
            name="phoneNumber"
            maxLength={10}
            type="tel"
            placeholder="Enter phone number"
            onChange={(e) => {
              // Automatically remove "+91" if user types it
              const value = e.target.value.replace(/\D/g, "");
              field.onChange(value);
            }}
          />
        </div>
      ) : (
        <Input
          {...field}
          name="username"
          type="text"
          placeholder="Enter username"
        />
      )}
      <div className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline"
        onClick={() => setLoginType(loginType === "username" ? "phone" : "username")}
      >
        {loginType === "username" ? "Login with Phone Number" : "Login with Username"}
      </div>
      <FormMessage />
    </FormItem>
  )}
/>

          <FormField
            name="password"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input placeholder="password" type="password" {...field} name="password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='w-full' >  Sign In  </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Not Have Account?{' '}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
            Sign Up
          </Link>
        </p>
      </div>

      <div className="text-center mt-4">
        <p>
         Admin Login?{' '}
          <Link href="/admin-sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in as Admin
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default SignInPage
