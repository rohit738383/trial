"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, CreditCard, Clock, CheckCircle } from "lucide-react"
// import { ExportDropdown } from "@/app/(admin-panel)/components/export-dropdown"
// import { ExportService } from "@/lib/export-utils"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axiosInstance"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [showTicketsModal, setShowTicketsModal] = useState(false)
  const [selectedTickets, setSelectedTickets] = useState<{ ticketCode: string }[]>([])

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      try {
        const res = await axiosInstance.get("/api/booking")
        if (res.data.success) {
          setBookings(res.data.bookings)
        }
      } catch (err) {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchTerm.toLowerCase().trim()
    const matchesSearch =
      searchTerm === "" ||
      booking.user?.fullName?.toLowerCase().includes(searchLower) ||
      booking.user?.phoneNumber?.toLowerCase().includes(searchLower) ||
      booking.user?.email?.toLowerCase().includes(searchLower) ||
      booking.seminar?.title?.toLowerCase().includes(searchLower) ||
      booking.id.toLowerCase().includes(searchLower) ||
      booking.status?.toLowerCase().includes(searchLower)

    const matchesStatus = statusFilter === "all" || booking.status?.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.status?.toLowerCase() === "paid").length,
    pending: bookings.filter((b) => b.status?.toLowerCase() === "pending").length,
    cancelled: bookings.filter((b) => b.status?.toLowerCase() === "cancelled").length,
  }

  const getStatusIcon = (status: string): React.ReactElement | null => {
    switch (status?.toLowerCase()) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <CreditCard className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const handleShowAllTickets = (tickets: { ticketCode: string }[]) => {
    setSelectedTickets(tickets)
    setShowTicketsModal(true)
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Bookings Management</h1>
          <p className="text-muted-foreground">Track and manage all seminar bookings</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.paid}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <CreditCard className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, seminar, booking ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[350px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <ExportDropdown
          onExport={(format) => ExportService.exportBookingsData(filteredBookings, format)}
          label="Export Bookings"
        /> */}
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>Complete list of seminar bookings with payment status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Seminar</TableHead>
                <TableHead>Seminar Date</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tickets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.user?.fullName}</div>
                      <div className="text-sm text-muted-foreground">{booking.user?.phoneNumber}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.seminar?.title}</div>
                  </TableCell>
                  <TableCell>
                    {booking.seminar?.date ? new Date(booking.seminar.date).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell className="font-medium">₹{booking.amount}</TableCell>
                  <TableCell>{booking.paymentMethod || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      <Badge
                        variant={
                          booking.status?.toLowerCase() === "paid"
                            ? "default"
                            : booking.status?.toLowerCase() === "pending"
                              ? "secondary"
                              : booking.status?.toLowerCase() === "cancelled"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.tickets && booking.tickets.length > 0 ? (
                      <div className="space-y-1">
                        {booking.tickets.length <= 3 ? (
                          <div className="flex flex-wrap gap-1">
                            {booking.tickets.map((t: { ticketCode: string }, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {t.ticketCode}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1">
                              {booking.tickets.slice(0, 2).map((t: { ticketCode: string }, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {t.ticketCode}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleShowAllTickets(booking.tickets)}
                            >
                              +{booking.tickets.length - 2} more tickets
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No tickets</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
      {/* Tickets Modal */}
      <Dialog open={showTicketsModal} onOpenChange={setShowTicketsModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>All Tickets</DialogTitle>
            <DialogDescription>Complete list of ticket codes for this booking</DialogDescription>
          </DialogHeader>
          <div className="max-h-96 overflow-y-auto">
            <div className="grid gap-2">
              {selectedTickets.map((ticket, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <span className="font-mono text-sm">{ticket.ticketCode}</span>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-sm text-muted-foreground">Total: {selectedTickets.length} tickets</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const ticketCodes = selectedTickets.map((t) => t.ticketCode).join("\n")
                navigator.clipboard.writeText(ticketCodes)
              }}
            >
              Copy All
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
