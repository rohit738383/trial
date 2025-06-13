"use client"

import axios from "axios"
import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useDebounceCallback } from 'usehooks-ts'
import * as z from "zod"
import { toast } from "sonner"
import axiosInstance from '@/lib/axiosInstance';
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


const page = () => {

    const[username, setUsername] = useState("")
    const[usernameMessage, setUsernameMessage] = useState("")
    const[isCheckUsername, setIsCheckUsername] = useState(false);
    const[isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 300);
    const router = useRouter();
    
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
          fullName: "",
          username: "",
          email: "",
          password: "",
          phoneNumber: "",
        },
      })

    useEffect(() => {
            const checkUsernameUnique = async () => {
                if(username){
                    setIsCheckUsername(true);
                    setUsernameMessage("");
                try {
                    const response = await axiosInstance.get(`/api/check-username-unique?username=${username}`);
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message || "Something went wrong" : "Something went wrong";
                    setUsernameMessage(errorMessage);
                    console.log(error)
                }
                finally{
                    setIsCheckUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {

          const phoneNumber = `+91${data.phoneNumber}`; 
      const payload = {
        ...data,
        phoneNumber, 
      };

            const response = await axiosInstance.post("/api/sign-up", payload);
            toast.success("Success", {
                description: response.data.message,
            }
            )
            router.replace(`/verify/${username}`)
        }
        catch(err){
      
            const errorMessage =
            axios.isAxiosError(err) ? err.response?.data?.message || "Something went wrong" : "Something went wrong";

            toast.error("Signup Failed", {
              
                description: errorMessage,  
            })
            setIsSubmitting(false);
        }
    }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          Studytainment
        </h1>
        <p className="mb-4">Sign up to start your study adventure</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        <FormField
            name="fullName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <Input placeholder="fullName" {...field} name="fullName" />
                <FormMessage />
              </FormItem>
            )}
          />


          <FormField
            name="username"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <Input placeholder="username"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debounced(e.target.value);
                  }}
                />
                {isCheckUsername && <Loader2 className="animate-spin" />}
                {!isCheckUsername && usernameMessage && (
                  <p
                    className={`text-sm ${
                      usernameMessage === 'Username is unique'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {usernameMessage}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

        <FormField
            name="phoneNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <div className="flex">
                <span className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-l text-sm text-gray-700 select-none">
                        +91
                      </span>
                <Input placeholder="phone number" maxLength={10} {...field}                 
               onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                field.onChange(value);
              }}
                name="phoneNumber" />
                </div>
                <p className='text-sm'>We will send you a verification code</p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input placeholder="email" {...field} name="email" />
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
          <Button type="submit" className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Already a member?{' '}
          <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default page
