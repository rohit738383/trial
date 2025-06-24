"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Edit2,
  Save,
  X,
  Phone,
  MapPin,
  User,
  GraduationCap,
  Users,
  Mail,
  Calendar,
  Star,
  Heart,
  Sparkles,
} from "lucide-react"
import axios from "axios"

interface ProfileData {
  fullName: string
  email: string
  phoneNumber: string
  profile?: {
    highestEducation: string
    address: string
    city: string
    state: string
    zipCode: string
    counterpartnerName: string
    counterpartnerPhoneNumber: string
    counterpartnerEducation: string
  }
  children: Array<{
    id: string
    name: string
    age: number
    className: string
  }>
}

export default function MyProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editingPhone, setEditingPhone] = useState(false)
  const [editingAddress, setEditingAddress] = useState(false)
  const [tempPhone, setTempPhone] = useState("")
  const [tempAddress, setTempAddress] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const res = await axios.get("/api/my-profile", {
        method: "GET",
        withCredentials: true,
      });
      setProfileData(res.data)
      setTempPhone(res.data.phoneNumber)
      setTempAddress({
        address: res.data.profile?.address || "",
        city: res.data.profile?.city || "",
        state: res.data.profile?.state || "",
        zipCode: res.data.profile?.zipCode || "",
      })
    } catch (err) {
      console.error("Error fetching profile", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const handlePhoneEdit = () => {
    setEditingPhone(true)
  }

  const handlePhoneSave = async () => {
    try {
      await axios.put("/api/my-profile", { phoneNumber: tempPhone })
      setProfileData((prev) => (prev ? { ...prev, phoneNumber: tempPhone } : null))
      setEditingPhone(false)
    } catch (err) {
      console.error("Error updating phone", err)
    }
  }

  const handlePhoneCancel = () => {
    setTempPhone(profileData?.phoneNumber || "")
    setEditingPhone(false)
  }

  const handleAddressEdit = () => {
    setEditingAddress(true)
  }

  const handleAddressSave = async () => {
    try {
      await axios.put("/api/my-profile", {
        profile: { ...tempAddress },
      })
      setProfileData((prev) => {
        if (!prev) return null
        const existingProfile = prev.profile || {
          highestEducation: "",
          counterpartnerName: "",
          counterpartnerPhoneNumber: "",
          counterpartnerEducation: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
        }
        return {
          ...prev,
          profile: {
            ...existingProfile,
            ...tempAddress,
          },
        }
      })
      setEditingAddress(false)
    } catch (err) {
      console.error("Error updating address", err)
    }
  }

  const handleAddressCancel = () => {
    setTempAddress({
      address: profileData?.profile?.address || "",
      city: profileData?.profile?.city || "",
      state: profileData?.profile?.state || "",
      zipCode: profileData?.profile?.zipCode || "",
    })
    setEditingAddress(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="container mx-auto px-3 py-4 sm:p-6 max-w-sm sm:max-w-6xl">
          {/* Loading Hero Section */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-3 sm:p-6 lg:p-8 mb-4 sm:mb-8">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Skeleton className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white/20" />
              <div className="space-y-3 text-center sm:text-left">
                <Skeleton className="h-6 sm:h-8 w-48 sm:w-64 bg-white/20 mx-auto sm:mx-0" />
                <Skeleton className="h-4 w-32 sm:w-48 bg-white/20 mx-auto sm:mx-0" />
              </div>
            </div>
          </div>

          {/* Loading Cards */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="p-2 sm:p-4 lg:p-6 space-y-2 sm:space-y-4 lg:space-y-6">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm p-4 sm:p-8 text-center mx-3 sm:mx-0 max-w-xs sm:max-w-md">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">Oops! Something went wrong</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-6">Failed to load your profile data</p>
            <Button
              onClick={fetchProfile}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full sm:w-auto"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-3 py-4 sm:p-6 max-w-sm sm:max-w-6xl">
        {/* Hero Profile Section */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-3 sm:p-6 lg:p-8 mb-4 sm:mb-8 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 sm:-translate-y-32 sm:translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white/10 rounded-full translate-y-12 -translate-x-12 sm:translate-y-24 sm:-translate-x-24"></div>

          <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 text-center">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white/30 shadow-xl">
              <AvatarImage src="/placeholder.svg?height=96&width=96" />
              <AvatarFallback className="text-xl sm:text-2xl font-bold bg-white/20 text-white">
                {getInitials(profileData.fullName)}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center justify-center gap-2 flex-wrap">
                <span className="break-words">{profileData.fullName}</span>
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-300 fill-current flex-shrink-0" />
              </h1>
              <p className="text-white/90 text-sm sm:text-base lg:text-lg mb-3 flex items-center gap-2 justify-center flex-wrap">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="break-all">{profileData.email}</span>
              </p>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 text-xs">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Family Member
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Personal Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 space-y-2 sm:space-y-4 lg:space-y-6">
              <div className="grid gap-2 sm:gap-4">
                <div className="p-2 sm:p-4 bg-emerald-50 rounded-lg sm:rounded-xl border border-emerald-100">
                  <Label className="text-xs font-semibold text-emerald-700 flex items-center gap-1 sm:gap-2">
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                    Full Name
                  </Label>
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                    {profileData.fullName}
                  </p>
                </div>

                <div className="p-2 sm:p-4 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-100">
                  <Label className="text-xs font-semibold text-blue-700 flex items-center gap-1 sm:gap-2">
                    <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                    Email Address
                  </Label>
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-all">
                    {profileData.email}
                  </p>
                </div>

                {/* Phone Number with Edit */}
                <div className="p-2 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-100">
                  <Label className="text-xs font-semibold text-purple-700 flex items-center gap-1 sm:gap-2">
                    <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                    Phone Number
                  </Label>
                  {editingPhone ? (
                    <div className="space-y-2 mt-2">
                      <Input
                        value={tempPhone}
                        onChange={(e) => setTempPhone(e.target.value)}
                        className="w-full border-purple-200 focus:border-purple-400 text-sm sm:text-base"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handlePhoneSave}
                          className="bg-green-500 hover:bg-green-600 flex-1 text-xs"
                        >
                          <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handlePhoneCancel}
                          className="border-red-200 text-red-600 hover:bg-red-50 flex-1 text-xs"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 break-all flex-1">
                        {profileData.phoneNumber}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handlePhoneEdit}
                        className="border-purple-200 text-purple-600 hover:bg-purple-50 flex-shrink-0"
                      >
                        <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="p-2 sm:p-4 bg-orange-50 rounded-lg sm:rounded-xl border border-orange-100">
                  <Label className="text-xs font-semibold text-orange-700 flex items-center gap-1 sm:gap-2">
                    <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                    Highest Education
                  </Label>
                  <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                    {profileData.profile?.highestEducation || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 space-y-2 sm:space-y-4 lg:space-y-6">
              {editingAddress ? (
                <div className="space-y-2 sm:space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-xs font-semibold text-gray-700">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      value={tempAddress.address}
                      onChange={(e) => setTempAddress((prev) => ({ ...prev, address: e.target.value }))}
                      className="mt-1 border-rose-200 focus:border-rose-400 text-sm sm:text-base"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:gap-4">
                    <div>
                      <Label htmlFor="city" className="text-xs font-semibold text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={tempAddress.city}
                        onChange={(e) => setTempAddress((prev) => ({ ...prev, city: e.target.value }))}
                        className="mt-1 border-rose-200 focus:border-rose-400 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-xs font-semibold text-gray-700">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={tempAddress.state}
                        onChange={(e) => setTempAddress((prev) => ({ ...prev, state: e.target.value }))}
                        className="mt-1 border-rose-200 focus:border-rose-400 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-xs font-semibold text-gray-700">
                        Zip Code
                      </Label>
                      <Input
                        id="zipCode"
                        value={tempAddress.zipCode}
                        onChange={(e) => setTempAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                        className="mt-1 border-rose-200 focus:border-rose-400 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button
                      onClick={handleAddressSave}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 w-full text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleAddressCancel}
                      className="border-red-200 text-red-600 hover:bg-red-50 w-full text-sm sm:text-base"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-4">
                  <div className="grid gap-2 sm:gap-4">
                    <div className="p-2 sm:p-4 bg-rose-50 rounded-lg sm:rounded-xl border border-rose-100">
                      <Label className="text-xs font-semibold text-rose-700">Street Address</Label>
                      <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                        {profileData.profile?.address || "Not specified"}
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                      <div className="p-2 sm:p-4 bg-pink-50 rounded-lg sm:rounded-xl border border-pink-100">
                        <Label className="text-xs font-semibold text-pink-700">City</Label>
                        <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                          {profileData.profile?.city || "Not specified"}
                        </p>
                      </div>
                      <div className="p-2 sm:p-4 bg-rose-50 rounded-lg sm:rounded-xl border border-rose-100">
                        <Label className="text-xs font-semibold text-rose-700">State</Label>
                        <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                          {profileData.profile?.state || "Not specified"}
                        </p>
                      </div>
                      <div className="p-2 sm:p-4 bg-pink-50 rounded-lg sm:rounded-xl border border-pink-100 sm:col-span-2 lg:col-span-1">
                        <Label className="text-xs font-semibold text-pink-700">Zip Code</Label>
                        <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                          {profileData.profile?.zipCode || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleAddressEdit}
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 w-full sm:w-auto text-sm sm:text-base"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partner Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Partner & Guardian Info
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 space-y-2 sm:space-y-4 lg:space-y-6">
              <div className="p-2 sm:p-4 bg-indigo-50 rounded-lg sm:rounded-xl border border-indigo-100">
                <Label className="text-xs font-semibold text-indigo-700">Partner Name</Label>
                <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                  {profileData.profile?.counterpartnerName || "Not specified"}
                </p>
              </div>
              <div className="p-2 sm:p-4 bg-purple-50 rounded-lg sm:rounded-xl border border-purple-100">
                <Label className="text-xs font-semibold text-purple-700 flex items-center gap-1 sm:gap-2">
                  <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                  Partner Phone
                </Label>
                <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-all">
                  {profileData.profile?.counterpartnerPhoneNumber || "Not specified"}
                </p>
              </div>
              <div className="p-2 sm:p-4 bg-indigo-50 rounded-lg sm:rounded-xl border border-indigo-100">
                <Label className="text-xs font-semibold text-indigo-700 flex items-center gap-1 sm:gap-2">
                  <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4" />
                  Partner Education
                </Label>
                <p className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 mt-1 break-words">
                  {profileData.profile?.counterpartnerEducation || "Not specified"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Children Information */}
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 fill-current" />
                Children
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6 space-y-2 sm:space-y-4 lg:space-y-6">
              {profileData.children && profileData.children.length > 0 ? (
                <div className="grid gap-2 sm:gap-4">
                  {profileData.children.map((child, index) => (
                    <div
                      key={child.id}
                      className="relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 p-2 sm:p-4 lg:p-6 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full -translate-y-6 translate-x-6 sm:-translate-y-8 sm:translate-x-8 lg:-translate-y-10 lg:translate-x-10"></div>
                      <div className="relative z-10">
                        <div className="flex items-start gap-2 mb-2">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-2 border-amber-200 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-amber-400 to-orange-400 text-white font-bold text-xs sm:text-sm lg:text-base">
                              {getInitials(child.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 break-words leading-tight">
                              {child.name}
                            </h3>
                            <div className="flex flex-col gap-1 mt-1">
                              <span className="flex items-center gap-1 text-xs text-gray-600">
                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                <span>{child.age} years old</span>
                              </span>
                              <span className="flex items-center gap-1 text-xs text-gray-600">
                                <GraduationCap className="h-3 w-3 flex-shrink-0" />
                                <span className="break-words">{child.className}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-xs">
                          Child #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users className="h-6 w-6 sm:h-8 sm:w-8 text-amber-500" />
                  </div>
                  <p className="text-gray-600 text-sm sm:text-base lg:text-lg">No children information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
