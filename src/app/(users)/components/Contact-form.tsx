"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import axios from "axios"
import * as z from "zod"
import { toast } from "sonner"
import { inquirySchema } from "@/schemas/inquirySchema"



export default function ContactForm() {
  const [formData, setFormData] = useState<Inquiry>({
    fullName: "",
    email: "",
    phoneNumber: "",
    subject: "",
    inquiryType: "General Information",
    message: "",
    status: "PENDING", 
    createdAt: new Date().toISOString(),
  })

  const inquiryTypes = [
    "General Information",
    "Seminar Booking",
    "Technical Support",
    "Payment Issues",
    "Partnership Opportunities",
    "Career Opportunities",
    "Feedback & Suggestions",
  ]

  type Inquiry = z.infer<typeof inquirySchema>

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const response = await axios.post("/api/inquiry" , formData);

    if(response.status === 200){
      toast.success("Inquiry sent successfully", {
        description : "We'll get back to you within 24 hours"
      })
    }else{
      toast.error("Failed to send inquiry", {
        description : "Please try again later"
      })
    }

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phoneNumber: "",
      subject: "",
      inquiryType: "General Information",
      message: "",
      status: "PENDING", 
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Contact Information */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Get in Touch</CardTitle>
            <CardDescription>{"We're here to help you with any questions about our educational programs"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-sm text-gray-600">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-gray-600">info@studytainment.com</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-600">
                  123 Education Street
                  <br />
                  Learning District, City 560001
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Office Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday & Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-blue-600" />
              <span>Send us a Message</span>
            </CardTitle>
            <CardDescription>{"Fill out the form below and we'll get back to you as soon as possible"}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                  <span className="px-3 py-2 bg-gray-100 border rounded text-gray-600 text-sm">+91</span>
                  <Input
                    id="phone"
                    value={formData.phoneNumber}
                    pattern="[0-9]*" 
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, "")
                      setFormData({ ...formData, phoneNumber: cleaned })
                    }}
                    placeholder="Enter your phone number"
                    maxLength={10}
                  />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inquiryType">Inquiry Type *</Label>
                  <Select
                    value={formData.inquiryType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, inquiryType: value as Inquiry["inquiryType"] })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inquiryTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief subject of your inquiry"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please provide details about your inquiry..."
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
