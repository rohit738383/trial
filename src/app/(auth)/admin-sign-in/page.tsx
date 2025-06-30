"use client"

import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { adminLoginSchema } from "@/schemas/adminLoginSchema"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Shield, User, Lock, ArrowRight, Crown, Settings, BarChart3, Users, Database, Zap } from "lucide-react"

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
      const response = await axios.post("/api/admin-signin", data, {
        withCredentials: true,
      })

      console.log(response)
      toast.success("verified successfully", {
        description: response.data.message,
      })

      router.replace("/admin/dashboard")
    } catch (error) {
      const errorMesssage = axios.isAxiosError(error)
        ? error.response?.data.message || "Something went wrong"
        : "Login Error"
      toast.error("Signin Failed", {
        description: errorMesssage,
      })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating elements with admin theme */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-indigo-500/15 rounded-full blur-xl animate-pulse delay-500"></div>

        {/* Admin-themed floating icons */}
        <div className="absolute top-1/6 right-1/6 w-8 h-8 bg-purple-400/20 rounded-lg flex items-center justify-center animate-bounce delay-300">
          <Settings className="w-4 h-4 text-purple-300/50" />
        </div>
        <div className="absolute bottom-1/3 left-1/6 w-8 h-8 bg-blue-400/20 rounded-lg flex items-center justify-center animate-bounce delay-700">
          <BarChart3 className="w-4 h-4 text-blue-300/50" />
        </div>
        <div className="absolute top-2/3 right-1/5 w-8 h-8 bg-indigo-400/20 rounded-lg flex items-center justify-center animate-bounce delay-1000">
          <Database className="w-4 h-4 text-indigo-300/50" />
        </div>

      
      </div>

      {/* Main Form Container */}
      <div className="w-full max-w-md relative z-10">
        {/* Admin Features Showcase */}
        <div className="text-center mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-purple-400/20">
              <Users className="w-6 h-6 text-purple-300" />
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-blue-400/20">
              <BarChart3 className="w-6 h-6 text-blue-300" />
            </div>
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-indigo-400/20">
              <Settings className="w-6 h-6 text-indigo-300" />
            </div>
          </div>
          <p className="text-gray-300 text-sm">Manage • Analytics • Control</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl relative">
              <Shield className="w-10 h-10 text-white" />
              <Crown className="w-4 h-4 text-yellow-300 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-300">Secure access to dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-200 font-medium">Admin Username</FormLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Enter admin username"
                        type="text"
                        {...field}
                        name="identifier"
                        className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm"
                      />
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
                    <FormLabel className="text-gray-200 font-medium">Admin Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Enter secure password"
                        type="password"
                        {...field}
                        name="password"
                        className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 backdrop-blur-sm"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 mt-8 border border-purple-400/20"
              >
                <Shield className="mr-2 h-5 w-5" />
                Access Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-400/20 rounded-lg backdrop-blur-sm">
            <div className="flex items-center text-yellow-300 text-sm">
              <Zap className="w-4 h-4 mr-2" />
              <span>Secure admin access - All activities are logged</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="text-center mt-6 pt-6 border-t border-white/10">
            <p className="text-gray-300">
              Need user access?{" "}
              <Link
                href="/sign-in"
                className="text-purple-400 hover:text-purple-300 font-medium hover:underline transition-colors"
              >
                Sign in as User
              </Link>
            </p>
          </div>
        </div>

        {/* Admin Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-xs text-gray-300">User Management</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <BarChart3 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-gray-300">Analytics</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
            <Settings className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs text-gray-300">System Control</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSignInPage
