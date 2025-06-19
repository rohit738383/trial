"use client"

import axios from "axios"
import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import type * as z from "zod"
import { toast } from "sonner"
import axiosInstance from "@/lib/axiosInstance"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Loader2,
  User,
  AtSign,
  Mail,
  Lock,
  CheckCircle,
  XCircle,
  BookOpen,
  GraduationCap,
  Trophy,
  Users,
  Star,
  ArrowRight,
} from "lucide-react"

const page = () => {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckUsername, setIsCheckUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 300)
  const router = useRouter()

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
      if (username) {
        setIsCheckUsername(true)
        setUsernameMessage("")
        try {
          const response = await axiosInstance.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          const errorMessage = axios.isAxiosError(error)
            ? error.response?.data?.message || "Something went wrong"
            : "Something went wrong"
          setUsernameMessage(errorMessage)
          console.log(error)
        } finally {
          setIsCheckUsername(false)
        }
      }
    }
    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const phoneNumber = `+91${data.phoneNumber}`
      const payload = {
        ...data,
        phoneNumber,
      }

      const response = await axiosInstance.post("/api/sign-up", payload)
      toast.success("Success", {
        description: response.data.message,
      })
      router.replace(`/verify/${username}`)
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message || "Something went wrong"
        : "Something went wrong"

      toast.error("Signup Failed", {
        description: errorMessage,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10"></div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16 text-white">
          {/* Logo & Brand */}
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4 backdrop-blur-sm">
                <BookOpen className="w-6 h-6" />
              </div>
              <h1 className="text-3xl font-bold">Studytainment</h1>
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Transform Your<br />
              Learning Journey
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-md">
              Join thousands of students who are making learning fun and interactive with our platform.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mb-12">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4 backdrop-blur-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Interactive Learning</h3>
                <p className="text-blue-100 text-sm">Engage with dynamic study materials </p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4 backdrop-blur-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Track Your Progress</h3>
                <p className="text-blue-100 text-sm">Monitor achievements and learning milestones</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mr-4 backdrop-blur-sm">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Study Community</h3>
                <p className="text-blue-100 text-sm">Connect and learn with fellow students</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex space-x-8">
            <div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-blue-200 text-sm">Students</div>
            </div>
            <div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-blue-200 text-sm">Courses</div>
            </div>
            <div>
              <div className="flex items-center">
                <span className="text-2xl font-bold mr-1">4.9</span>
                <Star className="w-4 h-4 fill-current" />
              </div>
              <div className="text-blue-200 text-sm">Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Circles */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/4 w-24 h-24 bg-purple-200/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-indigo-200/30 rounded-full blur-lg animate-pulse delay-500"></div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-1/6 left-1/6 w-8 h-8 bg-blue-300/20 rotate-45 rounded-sm animate-bounce delay-300"></div>
          <div className="absolute bottom-1/4 right-1/6 w-6 h-6 bg-purple-300/20 rotate-12 rounded-sm animate-bounce delay-700"></div>
          
        
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Studytainment</h1>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Studytainment</h2>
              <p className="text-gray-600">Start your learning adventure today</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <FormField
                  name="fullName"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Full Name</FormLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Username */}
                <FormField
                  name="username"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Username</FormLabel>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Choose a unique username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            debounced(e.target.value)
                          }}
                          className="pl-10 pr-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {isCheckUsername && <Loader2 className="animate-spin w-4 h-4 text-blue-500" />}
                          {!isCheckUsername &&
                            usernameMessage &&
                            (usernameMessage === "Username is unique" ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            ))}
                        </div>
                      </div>
                      {!isCheckUsername && usernameMessage && (
                        <p
                          className={`text-sm mt-1 ${
                            usernameMessage === "Username is unique" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone Number */}
                <FormField
                  name="phoneNumber"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                      <div className="flex">
                        <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-sm text-gray-700 font-medium">
                          +91
                        </span>
                        <Input
                          placeholder="Enter 10-digit number"
                          maxLength={10}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "")
                            field.onChange(value)
                          }}
                          className="h-11 rounded-l-none border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">We will send you a verification code</p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Enter your email address"
                          {...field}
                          className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  name="password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Create a strong password"
                          type="password"
                          {...field}
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Sign In Link */}
            <div className="text-center mt-6 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/sign-in"
                  className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
