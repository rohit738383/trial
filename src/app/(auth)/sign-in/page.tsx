"use client"

import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { toast } from "sonner"
import axiosInstance from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"
import { signInSchema } from "@/schemas/signInSchema"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuthStore } from "@/stores/useAuthStore"
import { BookOpen, User, Lock, Phone, AtSign, ArrowRight, Shield } from "lucide-react"

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
    }

    try {
      const response = await axiosInstance.post("/api/sign-in", payload, {
        withCredentials: true,
      })

      setUser(response.data.user)

      console.log(response)
      toast.success("verified successfully", {
        description: response.data.message,
      })

      router.push("/homepage")
    } catch (error) {
      const errorMesssage = axios.isAxiosError(error)
        ? error.response?.data.message || "Something went wrong"
        : "Login Error"
      toast.error("Sigin Failed", {
        description: errorMesssage,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large floating circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-indigo-200/30 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Small floating elements */}
        <div className="absolute top-1/6 right-1/6 w-8 h-8 bg-blue-300/30 rotate-45 rounded-sm animate-bounce delay-300"></div>
        <div className="absolute bottom-1/3 left-1/6 w-6 h-6 bg-purple-300/30 rotate-12 rounded-sm animate-bounce delay-700"></div>
        <div className="absolute top-2/3 right-1/5 w-4 h-4 bg-indigo-300/40 rounded-full animate-bounce delay-1000"></div>

     
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Studytainment
            </h1>
            <p className="text-gray-600">Welcome back! Let's get you started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Identifier Field */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      {loginType === "phone" ? "Phone Number" : "Username"}
                    </FormLabel>
                    {loginType === "phone" ? (
                      <div className="flex">
                        <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm text-gray-700 font-medium flex items-center">
                          +91
                        </span>
                        <div className="relative flex-1">
                          <Input
                            {...field}
                            name="phoneNumber"
                            maxLength={10}
                            type="tel"
                            placeholder="Enter 10-digit number"
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "")
                              field.onChange(value)
                            }}
                            className="h-11 rounded-l-none border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          {...field}
                          name="username"
                          type="text"
                          placeholder="Enter your username"
                          className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    )}
                    <div
                      className="text-sm text-blue-600 mt-2 cursor-pointer hover:text-blue-700 hover:underline transition-colors flex items-center gap-1"
                      onClick={() => setLoginType(loginType === "username" ? "phone" : "username")}
                    >
                      {loginType === "username" ? (
                        <>
                          <Phone className="w-3 h-3" />
                          Login with Phone Number
                        </>
                      ) : (
                        <>
                          <User className="w-3 h-3" />
                          Login with Username
                        </>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Enter your password"
                        type="password"
                        {...field}
                        name="password"
                        className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
              >
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          {/* Links Section */}
          <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/sign-up"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Sign Up
                </Link>
              </p>
            </div>

            <div className="text-center">
              <p className="text-gray-600 flex items-center justify-center gap-1">
                <Shield className="w-4 h-4" />
                Admin Login?{" "}
                <Link
                  href="/admin-sign-in"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors ml-1"
                >
                  Sign in as Admin
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
