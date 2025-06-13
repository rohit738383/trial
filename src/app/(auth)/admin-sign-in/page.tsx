"use client"

import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import axiosInstance from '@/lib/axiosInstance'
import { useRouter } from "next/navigation"
import { adminLoginSchema } from "@/schemas/adminLoginSchema"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"


const AdminSignInPage = () => {

  const router = useRouter()


const form = useForm<z.infer<typeof adminLoginSchema>>({
  resolver: zodResolver(adminLoginSchema),
  defaultValues: {
    identifier: "",
    password: "",
  },
})

const onSubmit = async (data: z.infer<typeof adminLoginSchema>) => {


  try {
    const response = await axiosInstance.post("/api/admin-signin", data,{
      withCredentials: true 
    })

    console.log(response)
    toast.success("verified successfully",{
        description: response.data.message,
    })
    
    router.replace('/admin/dashboard');
   


  } catch (error) {
      const errorMesssage = axios.isAxiosError(error) ? error.response?.data.message || "Something went wrong" : "Login Error"; 
    toast.error("Signin Failed", {
      description: errorMesssage,  
  })
  }
}

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Admin Login
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
                <FormLabel>Username</FormLabel>
                <Input placeholder="username" type="text" {...field} name="identifier" />
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
          Not Have A Admin Account?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign In as User
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default AdminSignInPage
