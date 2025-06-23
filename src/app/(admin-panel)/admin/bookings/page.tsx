"use client"

import { useState } from "react"
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

// Mock data
const bookings = [
  {
    id: 1,
    bookingId: "BK001",
    userName: "John Doe",
    userEmail: "john@example.com",
    seminarTitle: "Advanced React Patterns",
    seminarDate: "2024-02-15",
    bookingDate: "2024-01-20",
    amount: 100,
    status: "paid",
    paymentMethod: "Credit Card",
    ticketNumber: "TKT-2024-001",
  },
  {
    id: 2,
    bookingId: "BK002",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    seminarTitle: "Node.js Masterclass",
    seminarDate: "2024-02-20",
    bookingDate: "2024-01-22",
    amount: 120,
    status: "pending",
    paymentMethod: "PayPal",
    ticketNumber: null,
  },
  // Add more bookings with ticket numbers for paid status
  {
    id: 3,
    bookingId: "BK003",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    seminarTitle: "Database Design Fundamentals",
    seminarDate: "2024-02-25",
    bookingDate: "2024-01-25",
    amount: 80,
    status: "paid",
    paymentMethod: "Bank Transfer",
    ticketNumber: "TKT-2024-002",
  },
  {
    id: 4,
    bookingId: "BK004",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    seminarTitle: "UI/UX Design Principles",
    seminarDate: "2024-03-01",
    bookingDate: "2024-01-28",
    amount: 90,
    status: "paid",
    paymentMethod: "Credit Card",
    ticketNumber: "TKT-2024-003",
  },
  {
    id: 5,
    bookingId: "BK005",
    userName: "David Brown",
    userEmail: "david@example.com",
    seminarTitle: "Advanced React Patterns",
    seminarDate: "2024-02-15",
    bookingDate: "2024-01-30",
    amount: 100,
    status: "pending",
    paymentMethod: "PayPal",
    ticketNumber: null,
  },
  {
    id: 6,
    bookingId: "BK006",
    userName: "Lisa Garcia",
    userEmail: "lisa@example.com",
    seminarTitle: "Node.js Masterclass",
    seminarDate: "2024-02-20",
    bookingDate: "2024-02-01",
    amount: 120,
    status: "cancelled",
    paymentMethod: "Credit Card",
    ticketNumber: null,
  },
  // Add more bookings for pagination
  {
    id: 7,
    bookingId: "BK007",
    userName: "Alex Johnson",
    userEmail: "alex@example.com",
    seminarTitle: "Python Basics",
    seminarDate: "2024-03-05",
    bookingDate: "2024-02-05",
    amount: 75,
    status: "paid",
    paymentMethod: "Credit Card",
    ticketNumber: "TKT-2024-004",
  },
  {
    id: 8,
    bookingId: "BK008",
    userName: "Emma Davis",
    userEmail: "emma@example.com",
    seminarTitle: "JavaScript Advanced",
    seminarDate: "2024-03-10",
    bookingDate: "2024-02-08",
    amount: 110,
    status: "paid",
    paymentMethod: "PayPal",
    ticketNumber: "TKT-2024-005",
  },
  {
    id: 9,
    bookingId: "BK009",
    userName: "Robert Wilson",
    userEmail: "robert@example.com",
    seminarTitle: "CSS Mastery",
    seminarDate: "2024-03-15",
    bookingDate: "2024-02-10",
    amount: 85,
    status: "pending",
    paymentMethod: "Bank Transfer",
    ticketNumber: null,
  },
  {
    id: 10,
    bookingId: "BK010",
    userName: "Sophie Brown",
    userEmail: "sophie@example.com",
    seminarTitle: "React Native",
    seminarDate: "2024-03-20",
    bookingDate: "2024-02-12",
    amount: 130,
    status: "paid",
    paymentMethod: "Credit Card",
    ticketNumber: "TKT-2024-006",
  },
]

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.seminarTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)

  const stats = {
    total: bookings.length,
    paid: bookings.filter((b) => b.status === "paid").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    totalRevenue: bookings.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.amount, 0),
    pendingRevenue: bookings.filter((b) => b.status === "pending").reduce((sum, b) => sum + b.amount, 0),
  }

  const getStatusIcon = (status: string): React.ReactElement | null => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "cancelled":
        return <CreditCard className="h-4 w-4 text-red-600" />;
      default:
        return null;
    }
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Revenue</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.pendingRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
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
                <TableHead>Ticket Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.bookingId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.userName}</div>
                      <div className="text-sm text-muted-foreground">{booking.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{booking.seminarTitle}</div>
                  </TableCell>
                  <TableCell>{booking.seminarDate}</TableCell>
                  <TableCell>{booking.bookingDate}</TableCell>
                  <TableCell className="font-medium">${booking.amount}</TableCell>
                  <TableCell>{booking.paymentMethod}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(booking.status)}
                      {/* <Badge variant={getStatusVariant(booking.status)}>{booking.status}</Badge> */}
                    </div>
                  </TableCell>
                  <TableCell>
                    {booking.ticketNumber ? (
                      <Badge variant="outline" className="font-mono">
                        {booking.ticketNumber}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
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
    </div>
  )
}
