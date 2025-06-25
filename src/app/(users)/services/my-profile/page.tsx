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
  Home,
  UserCheck,
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
      })
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
        address: tempAddress.address,
        city: tempAddress.city,
        state: tempAddress.state,
        zipcode: tempAddress.zipCode,
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
            address: tempAddress.address,
            city: tempAddress.city,
            state: tempAddress.state,
            zipCode: tempAddress.zipCode,
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Loading Header */}
          <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3 text-center md:text-left">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
          </div>

          {/* Loading Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="shadow-sm border-0">
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Profile</h2>
          <p className="text-gray-600 mb-6">{"We couldn't fetch your profile data. Please try again."}</p>
          <Button onClick={fetchProfile} className="w-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Retry
          </Button>
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-gray-100">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-2xl font-bold bg-gray-900 text-white">
                  {getInitials(profileData.fullName)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <Star className="h-4 w-4 text-white fill-current" />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profileData.fullName}</h1>
              <p className="text-gray-600 mb-3 flex items-center gap-2 justify-center md:justify-start">
                <Mail className="h-4 w-4" />
                {profileData.email}
              </p>
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                <Heart className="h-3 w-3 mr-1 fill-current" />
                Family Member
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Personal Information */}
          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{profileData.fullName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-gray-900 break-all">{profileData.email}</p>
                  </div>
                </div>

                {/* Phone Number with Edit */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  </div>
                  {editingPhone ? (
                    <div className="space-y-3">
                      <Input value={tempPhone} onChange={(e) => setTempPhone(e.target.value)} className="w-full" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handlePhoneSave} className="flex-1">
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={handlePhoneCancel} className="flex-1">
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-gray-900">{profileData.phoneNumber}</p>
                      <Button size="sm" variant="ghost" onClick={handlePhoneEdit}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Education</p>
                    <p className="text-gray-900">{profileData.profile?.highestEducation || "Not specified"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Home className="h-5 w-5 text-green-600" />
                </div>
                Address Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingAddress ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Street Address
                    </Label>
                    <Input
                      id="address"
                      value={tempAddress.address}
                      onChange={(e) => setTempAddress((prev) => ({ ...prev, address: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                        City
                      </Label>
                      <Input
                        id="city"
                        value={tempAddress.city}
                        onChange={(e) => setTempAddress((prev) => ({ ...prev, city: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                        State
                      </Label>
                      <Input
                        id="state"
                        value={tempAddress.state}
                        onChange={(e) => setTempAddress((prev) => ({ ...prev, state: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                      Zip Code
                    </Label>
                    <Input
                      id="zipCode"
                      value={tempAddress.zipCode}
                      onChange={(e) => setTempAddress((prev) => ({ ...prev, zipCode: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button onClick={handleAddressSave} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleAddressCancel} className="flex-1">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-gray-900">{profileData.profile?.address || "Not specified"}</p>
                        <div className="flex gap-4 mt-2 text-sm text-gray-600">
                          <span>{profileData.profile?.city || "N/A"}</span>
                          <span>{profileData.profile?.state || "N/A"}</span>
                          <span>{profileData.profile?.zipCode || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleAddressEdit} className="w-full">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Address
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Partner Information */}
          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="h-5 w-5 text-purple-600" />
                </div>
                Partner Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Partner Name</p>
                  <p className="text-gray-900">{profileData.profile?.counterpartnerName || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Partner Phone</p>
                  <p className="text-gray-900">{profileData.profile?.counterpartnerPhoneNumber || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Partner Education</p>
                  <p className="text-gray-900">{profileData.profile?.counterpartnerEducation || "Not specified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children Information */}
          <Card className="shadow-sm border-0 hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Heart className="h-5 w-5 text-orange-600 fill-current" />
                </div>
                Children
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profileData.children && profileData.children.length > 0 ? (
                <div className="space-y-4">
                  {profileData.children.map((child, index) => (
                    <div
                      key={child.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Avatar className="h-12 w-12 border-2 border-orange-200">
                        <AvatarFallback className="bg-orange-500 text-white font-bold">
                          {getInitials(child.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{child.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {child.age} years old
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {child.className}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        Child #{index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No children information available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
