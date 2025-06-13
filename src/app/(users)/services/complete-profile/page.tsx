"use client"

import type React from "react"
import { useState , useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react"
import  Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/useAuthStore"


type Child = {
  name: string
  age: string
  gender: "MALE" | "FEMALE"
  className: string
}

export default function CompleteProfile() {

  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [form, setForm] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    highestEducation: "",
    areaOfInterest: "",
    relationToChild: "",
    children: [
      {
        name: "",
        age: "",
        gender: "MALE" as const,
        className: "",
      },
    ] as Child[],
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })

        if (!res.ok) throw new Error("Failed to fetch profile")

        const data = await res.json()
        if (data.profile) {
          const { children = [], ...rest } = data.profile
          setForm({
            ...rest,
            children: children.length > 0
              ? children.map((child: any) => ({
                  ...child,
                  age: child.age.toString(),
                }))
              : [
                  {
                    name: "",
                    age: "",
                    gender: "MALE",
                    className: "",
                  },
                ],
          })
        }
      } catch (error) {
        console.error("Error loading profile", error)
      }
    }

    fetchProfile()
  }, [])



  const calculateProgress = (): { completion: number; missingFields: string[] } => {
    const basicFields = [
      { name: "address", value: form.address },
      { name: "city", value: form.city },
      { name: "state", value: form.state },
      { name: "zipCode", value: form.zipCode },
      { name: "highestEducation", value: form.highestEducation },
      { name: "areaOfInterest", value: form.areaOfInterest },
      { name: "relationToChild", value: form.relationToChild },
    ];

    const childrenComplete = form.children.every((child) => 
      child.name && child.age && child.className
    );

    const missingFields = basicFields
      .filter((field) => !field.value.trim())
      .map((field) => field.name);

    const completed = basicFields.filter((field) => field.value.trim()).length;
    const totalFields = basicFields.length + (childrenComplete ? 1 : 0);
    
    return {
      completion: totalFields > 0 ? Math.round((completed / totalFields) * 100) : 0,
      missingFields
    };
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const { name, value } = e.target

    if (name.startsWith("child.") && index !== undefined) {
      const key = name.replace("child.", "") as keyof Child
      const updatedChildren = [...form.children]

      if (key === "gender") {
        updatedChildren[index][key] = value as "MALE" | "FEMALE"
      } else {
        updatedChildren[index][key] = value
      }

      setForm({ ...form, children: updatedChildren })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

  const handleSelectChange = (name: string, value: string, index?: number) => {
    if (name.startsWith("child.") && index !== undefined) {
      const key = name.replace("child.", "") as keyof Child
      const updatedChildren = [...form.children]
      updatedChildren[index][key] = value as any
      setForm({ ...form, children: updatedChildren })
    } else {
      setForm({ ...form, [name]: value })
    }
  }

 
  const addChild = () => {
    setForm({
      ...form,
      children: [...form.children, { name: "", age: "", gender: "MALE", className: "" }],
    })
  }

  const removeChild = (index: number) => {
    setForm({
      ...form,
      children: form.children.filter((_, i) => i !== index),
    })
  }

  

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
  
    try {
      // 🧹 Remove blank children (name & className both required)
      const cleanedChildren = form.children.filter((child) => {
        const hasName = child.name?.trim() !== "";
        const hasClass = child.className?.trim() !== "";
        return hasName && hasClass;
      });
  
      const formattedForm = {
        ...form,
        children: cleanedChildren.map((child) => ({
          ...child,
          age: Number(child.age),
        })),
      };
  
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedForm),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
  
        toast.success("Profile updated successfully")

      // Update Zustand store
      useAuthStore.getState().setUser(data.user);
      console.log(" User updated after submit:", useAuthStore.getState().user);
  
      router.replace("/homepage");
    } catch (err: any) {
      toast.error("Profile update failed",{
        description: err.message,
      })
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const { completion: progress } = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="text-gray-600 mt-2">Help us personalize your learning experience</p>
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-xs text-gray-500 mt-2">
              {progress < 100 ? `${100 - progress}% remaining to complete your profile` : "Profile completed!"}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Your location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={form.zipCode}
                    onChange={handleChange}
                    placeholder="Enter your ZIP code"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Educational Background */}
          <Card>
            <CardHeader>
              <CardTitle>Educational Background</CardTitle>
              <CardDescription>Your educational qualifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="highestEducation">Highest Education</Label>
                <Select
                  value={form.highestEducation}
                  onValueChange={(value) => handleSelectChange("highestEducation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your highest education" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="diploma">Diploma</SelectItem>
                    <SelectItem value="associate">Associate Degree</SelectItem>
                    <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                    <SelectItem value="master">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="areaOfInterest">Area of Interest</Label>
                <Input
                  id="areaOfInterest"
                  name="areaOfInterest"
                  value={form.areaOfInterest}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Science, Literature"
                />
              </div>
            </CardContent>
          </Card>

          {/* Relationship Information */}
          <Card>
            <CardHeader>
              <CardTitle>Relationship Information</CardTitle>
              <CardDescription>Your relationship to the child/children</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="relationToChild">Relation to Child</Label>
                <Select
                  value={form.relationToChild}
                  onValueChange={(value) => handleSelectChange("relationToChild", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your relation to child" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                    <SelectItem value="grandparent">Grandparent</SelectItem>
                    <SelectItem value="uncle">Uncle</SelectItem>
                    <SelectItem value="aunt">Aunt</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Children Information */}
          <Card>
            <CardHeader>
              <CardTitle>Children Information</CardTitle>
              <CardDescription>Details about your children</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {form.children.map((child, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Child {index + 1}</h4>
                    {form.children.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeChild(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`child-name-${index}`}>Child's Name</Label>
                      <Input
                        id={`child-name-${index}`}
                        name="child.name"
                        value={child.name}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Enter child's name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`child-age-${index}`}>Age</Label>
                      <Input
                        id={`child-age-${index}`}
                        name="child.age"
                        type="number"
                        value={child.age}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Enter age"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`child-gender-${index}`}>Gender</Label>
                      <Select
                        value={child.gender}
                        onValueChange={(value) => handleSelectChange("child.gender", value, index)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`child-class-${index}`}>Class Name</Label>
                      <Input
                        id={`child-class-${index}`}
                        name="child.className"
                        value={child.className}
                        onChange={(e) => handleChange(e, index)}
                        placeholder="Enter class name"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" onClick={addChild} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Child
              </Button>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Save for Later
              </Button>
            </Link>
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? "Updating..." : "Complete Profile"}
            </Button>
          </div>

          {message && (
            <div className="text-center">
              <p className={`text-sm ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
