"use client"

import { Calendar, Clock, MapPin, TicketIcon, Download, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { generateSeminarTicketsPDF } from "@/utilis/ticket-pdf-generator"
import { useEffect, useState } from "react"
import axios from "axios"

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
      const response = await axios.get("/api/booking/me", {
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
    } catch (err) {
      setError("Failed to fetch bookings")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


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
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Loading your bookings...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchBookings} variant="outline">
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
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booked Seminars</h1>
            <p className="text-gray-600">Details of Seminars booked by you</p>
          </div>
          <div className="text-center py-12">
            <TicketIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">You are not enrolled in our any Seminar.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2"> Booked Seminars</h1>
          <p className="text-gray-600">Details of Seminars booked by you</p>
        </div>

        <div className="grid gap-6">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl mb-2">{booking.seminar.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {booking.tickets.length} Tickets
                    </Badge>
                    <Button
                      onClick={() => generateSeminarTicketsPDF(transformBookingForPDF(booking))}
                      size="sm"
                      variant="secondary"
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Seminar Details */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Date</p>
                        <p className="text-gray-600">{formatDate(booking.seminar.date)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Time</p>
                        <p className="text-gray-600">{booking.seminar.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">Location</p>
                        <p className="text-gray-600">{booking.seminar.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tickets List */}
                  <div className="lg:col-span-2">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <TicketIcon className="h-5 w-5 text-purple-600" />
                          <p className="font-medium text-gray-900">Ticket Codes ({booking.tickets.length})</p>
                        </div>
                        <Button
                          onClick={() => generateSeminarTicketsPDF(transformBookingForPDF(booking))}
                          size="sm"
                          variant="outline"
                          className="text-purple-600 border-purple-600 hover:bg-purple-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download All
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
                        {booking.tickets.map((ticket, index) => (
                          <div key={ticket.ticketCode} className="bg-white p-3 rounded border">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Ticket #{index + 1}</span>
                              <span className="font-mono text-sm font-medium text-purple-600">{ticket.ticketCode}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mt-4">
                      <p className="text-sm text-blue-800">
                        <strong>Important:</strong> Please bring your ticket to attend the seminar.
                      </p>
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
