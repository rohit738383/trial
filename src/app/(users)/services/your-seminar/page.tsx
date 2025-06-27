"use client"

import { Calendar, Clock, MapPin, TicketIcon, Download, Loader2, Sparkles, Trophy, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateSeminarTicketsPDF } from "@/utilis/ticket-pdf-generator"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axiosInstance"

interface Ticket {
  ticketCode: string
}

interface Seminar {
  id: number
  title: string
  date: string
  time: string
  location: string
}

interface Booking {
  id: number
  seminar: Seminar
  tickets: Ticket[]
}

export default function Component() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/api/booking/me", {
        method: "GET",
        withCredentials: true,
      })
      const data = response.data

      if (data.success) {
        setBookings(data.bookings)
        setError(null)
      } else {
        setError(data.message)
      }
    } catch {
      setError("Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getTotalTickets = () => {
    return bookings.reduce((total, booking) => total + booking.tickets.length, 0)
  }

  // Transform booking data for PDF generation
  const transformBookingForPDF = (booking: Booking) => {
    return {
      id: booking.seminar.id,
      title: booking.seminar.title,
      date: booking.seminar.date,
      time: booking.seminar.time,
      location: booking.seminar.location,
      tickets: booking.tickets,
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse" />
                <Loader2 className="h-16 w-16 animate-spin mx-auto mb-6 text-blue-600 relative z-10" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Your Journey</h3>
              <p className="text-gray-600">Fetching your amazing seminar bookings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
                <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={fetchBookings}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600">Discover and track your seminar adventures</p>
          </div>

          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20" />
              <div className="relative bg-white rounded-full p-8 w-32 h-32 mx-auto shadow-xl">
                <TicketIcon className="h-16 w-16 text-blue-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Learning?</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {"You haven't enrolled in any seminars yet. Explore our amazing collection of knowledge-packed sessions!"}
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3">
              <Sparkles className="w-5 h-5 mr-2" />
              Explore Seminars
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Trophy className="w-4 h-4" />
            Your Learning Portfolio
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
            Booked Seminars
          </h1>
          <p className="text-xl text-gray-600 mb-6">Track your knowledge journey and upcoming sessions</p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
              <div className="text-sm text-gray-600">Seminars</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{getTotalTickets()}</div>
              <div className="text-sm text-gray-600">Total Tickets</div>
            </div>
          </div>
        </div>

        {/* Seminars Grid */}
        <div className="grid gap-8">
          {bookings.map((booking, index) => (
            <Card
              key={booking.id}
              className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm"
            >
              <CardHeader className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600" />
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16" />
                  <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12" />
                </div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Top badges */}
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-3 py-1">
                          <span className="font-semibold">#{index + 1}</span>
                        </Badge>
                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 px-3 py-1">
                          <Users className="w-4 h-4 mr-1" />
                          {booking.tickets.length} Tickets
                        </Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-100 border-emerald-300/30 px-3 py-1">
                          ✓ Confirmed
                        </Badge>
                      </div>

                      {/* Title */}
                      <CardTitle className="text-2xl font-bold mb-3 leading-tight text-white">
                        {booking.seminar.title}
                      </CardTitle>

                      {/* Booking ID */}
                      <div className="flex items-center gap-2 text-blue-100">
                        <span className="text-sm opacity-90">Booking ID:</span>
                        <span className="font-mono font-semibold bg-white/10 px-2 py-1 rounded text-sm">
                          #{booking.id}
                        </span>
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="ml-4">
                      <Button
                        onClick={() => generateSeminarTicketsPDF(transformBookingForPDF(booking))}
                        size="lg"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Download className="h-5 w-5 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Seminar Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Calendar className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Date</p>
                          <p className="text-gray-600">{formatDate(booking.seminar.date)}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Time</p>
                          <p className="text-gray-600">{booking.seminar.time}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-red-50 rounded-xl">
                        <div className="bg-red-100 p-2 rounded-lg">
                          <MapPin className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Location</p>
                          <p className="text-gray-600">{booking.seminar.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tickets Section */}
                  <div className="lg:col-span-3">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-2xl border border-purple-100">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-2 rounded-lg">
                            <TicketIcon className="h-6 w-6 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Your Tickets</h3>
                            <p className="text-sm text-gray-600">{booking.tickets.length} tickets booked</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => generateSeminarTicketsPDF(transformBookingForPDF(booking))}
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download All
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto pr-2">
                        {booking.tickets.map((ticket, ticketIndex) => (
                          <div
                            key={ticket.ticketCode}
                            className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Ticket #{ticketIndex + 1}
                              </span>
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            </div>
                            <div className="font-mono text-sm font-bold text-purple-600 bg-purple-50 p-2 rounded-lg text-center">
                              {ticket.ticketCode}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-4 rounded-xl mt-6">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 p-1 rounded-full mt-0.5">
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-blue-900 mb-1">Important Reminder</p>
                          <p className="text-sm text-blue-800">
                            Please bring your ticket code and valid ID to attend the seminar. Arrive 15 minutes early
                            for check-in.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
