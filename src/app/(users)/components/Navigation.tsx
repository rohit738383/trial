"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Brain, ChevronDown, ChevronUp, Menu, LogOut, User, Calendar } from "lucide-react"
import { toast } from "sonner"
// import Image from "next/image"
import { useAuthStore } from "@/stores/useAuthStore"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  const user = useAuthStore((state) => state.user)
  console.log(user)
  const clearUser = useAuthStore((state) => state.clearUser)
  const fetchUser = useAuthStore((state) => state.fetchUser)

  const [servicesOpen, setServicesOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchUser()
  }, [fetchUser])

  const services = [
    { name: "Studytainment Classroom", href: "/services/classroom" },
    { name: "Smart Study", href: "/services/smart-study" },
    { name: "Online Classes", href: "/services/online" },
    { name: "Activity Classes", href: "/services/activity" },
    { name: "Android App", href: "/services/app" },
  ]

  const handleLogout = async () => {
    try {
      await axios.post("/api/sign-out", {
        credentials: "include",
      })
      clearUser()
      router.push("/")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const getInitials = (name: string) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const profileCompletion = user?.profileCompletion?.percentage ?? null

  const isLoading = user && profileCompletion === undefined

  const handleServiceClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      router.push("/sign-up")
      return
    }
    toast.info("Coming Soon")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center px-4 justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-blue-600" />
          {/* <Image
                src="/logo.jpg?height=600&width=600"
                alt="Students learning with technology"
                width={90}
                height={60}
                className="rounded-2xl shadow-2xl  max-w-md sm:max-w-lg mx-auto"
              /> */}
          <span className="text-xl font-bold text-gray-900">Studytainment</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-blue-600">
            About Us
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 hover:text-blue-600">
              <span>Our Services</span>
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {services.map((service) => (
                <DropdownMenuItem key={service.name} asChild>
                  <Link href={service.href} onClick={handleServiceClick}>
                    {service.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link href="/why-choose-us" className="hover:text-blue-600">
            Why Choose Us
          </Link>
          <Link href="/seminars" className="hover:text-blue-600">
            Seminars & Events
          </Link>
          <Link href="/contact-form" className="hover:text-blue-600">
            Contact Us
          </Link>
          <Link href="/career" className="hover:text-blue-600">
            Careers
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {isClient && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-10">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="bg-blue-600 text-white text-sm">
                      {getInitials(user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{user.username.split(" ")[0]}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                {/* Profile Completion UI - Desktop */}
                {!isLoading && profileCompletion !== null && profileCompletion < 100 && (
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Profile Completion</span>
                      <span className="text-xs text-gray-500">{profileCompletion}%</span>
                    </div>
                    <Progress value={profileCompletion} className="h-2" />
                    <Link href="/services/complete-profile">
                      <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600 hover:text-blue-700">
                        Complete Profile
                      </Button>
                    </Link>
                  </div>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/services/my-profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services/your-seminar" className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Your Seminars
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Join Now
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Nav */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-auto">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
            <div className="h-full overflow-y-auto pb-20">
              <SheetHeader className="p-6">
                <SheetTitle className="flex items-center space-x-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  <span>Studytainment</span>
                </SheetTitle>
                <SheetDescription>Navigate through our educational platform</SheetDescription>
              </SheetHeader>

              {isClient && user && (
                <div className="px-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                      <AvatarFallback className="bg-blue-600 text-white">{getInitials(user.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {/* Profile Completion UI - Mobile */}
                  {!isLoading && profileCompletion !== null && profileCompletion < 100 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Profile Completion</span>
                        <span className="text-xs text-gray-500">{profileCompletion}%</span>
                      </div>
                      <Progress value={profileCompletion} className="h-2" />
                      <Link href="/services/complete-profile">
                        <Button variant="ghost" size="sm" className="w-full mt-2 text-blue-600 hover:text-blue-700">
                          Complete Profile
                        </Button>
                      </Link>
                    </div>
                  )}
                  <Link
                    href="/services/my-profile"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-lg font-medium text-gray-900 hover:text-blue-600"
                  >
                    <Button variant="outline" size="sm" className="w-full justify-start mb-2">
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Button>
                  </Link>
                  <Link href="/services/your-seminar" onClick={() => setIsOpen(false)} className="w-full">
                    <Button variant="outline" size="sm" className="w-full justify-start mb-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      Your Seminars
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile nav links */}
              <nav className="flex flex-col space-y-4 px-6">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Home
                </Link>
                <Link href="/about" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  About Us
                </Link>
                <div className="space-y-2">
                  <button
                    type="button"
                    className="flex items-center w-full text-lg font-medium text-gray-900 hover:text-blue-600 focus:outline-none"
                    onClick={() => setServicesOpen((prev) => !prev)}
                  >
                    <span>Our Services</span>
                    {servicesOpen ? (
                      <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                  </button>
                  {servicesOpen && (
                    <div className="pl-4 space-y-2">
                      {services.map((service) => (
                        <Link
                          key={service.name}
                          href={service.href}
                          onClick={(e) => {
                            handleServiceClick(e)
                            setIsOpen(false)
                          }}
                          className="block text-gray-600 hover:text-blue-600"
                        >
                          {service.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link href="/why-choose-us" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Why Choose Us
                </Link>
                <Link href="/seminars" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Seminars & Events
                </Link>
                <Link href="/contact-form" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Contact Us
                </Link>
                <Link href="/career" onClick={() => setIsOpen(false)} className="text-lg font-medium">
                  Careers
                </Link>
                {!user && (
                  <div className="flex flex-col space-y-2 pt-4 border-t">
                    <Link href="/sign-in" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Join Now</Button>
                    </Link>
                  </div>
                )}
                {/* Move logout button to the very bottom, only if user is logged in */}
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-red-600 hover:text-red-700 mt-6"
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                )}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
