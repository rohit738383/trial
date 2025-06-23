"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Users, UserCheck, UserX, Mail, Filter } from "lucide-react"
import { ExportDropdown } from "@/app/(admin-panel)/components/export-dropdown"
// import { ExportService } from "@/lib/export-utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    joinDate: "2024-01-15",
    totalBookings: 3,
    totalSpent: 300,
    status: "active",
    lastLogin: "2024-02-01",
    hasCompletedBookings: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    joinDate: "2024-01-18",
    totalBookings: 2,
    totalSpent: 220,
    status: "active",
    lastLogin: "2024-01-30",
    hasCompletedBookings: true,
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    joinDate: "2024-01-20",
    totalBookings: 1,
    totalSpent: 80,
    status: "active",
    lastLogin: "2024-01-28",
    hasCompletedBookings: true,
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    joinDate: "2024-01-22",
    totalBookings: 4,
    totalSpent: 380,
    status: "active",
    lastLogin: "2024-02-02",
    hasCompletedBookings: true,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    joinDate: "2024-01-25",
    totalBookings: 0,
    totalSpent: 0,
    status: "active",
    lastLogin: "2024-01-26",
    hasCompletedBookings: false,
  },
  {
    id: 6,
    name: "Lisa Garcia",
    email: "lisa@example.com",
    joinDate: "2024-01-28",
    totalBookings: 0,
    totalSpent: 0,
    status: "inactive",
    lastLogin: "2024-01-29",
    hasCompletedBookings: false,
  },
  {
    id: 7,
    name: "Alex Johnson",
    email: "alex@example.com",
    joinDate: "2024-02-01",
    totalBookings: 2,
    totalSpent: 185,
    status: "active",
    lastLogin: "2024-02-05",
    hasCompletedBookings: true,
  },
  {
    id: 8,
    name: "Emma Davis",
    email: "emma@example.com",
    joinDate: "2024-02-03",
    totalBookings: 1,
    totalSpent: 110,
    status: "active",
    lastLogin: "2024-02-08",
    hasCompletedBookings: true,
  },
  {
    id: 9,
    name: "Robert Wilson",
    email: "robert@example.com",
    joinDate: "2024-02-05",
    totalBookings: 0,
    totalSpent: 0,
    status: "active",
    lastLogin: "2024-02-10",
    hasCompletedBookings: false,
  },
  {
    id: 10,
    name: "Sophie Brown",
    email: "sophie@example.com",
    joinDate: "2024-02-07",
    totalBookings: 1,
    totalSpent: 130,
    status: "active",
    lastLogin: "2024-02-12",
    hasCompletedBookings: true,
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [bookingFilter, setBookingFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBookingFilter =
      bookingFilter === "all" ||
      (bookingFilter === "with-bookings" && user.hasCompletedBookings) ||
      (bookingFilter === "no-bookings" && !user.hasCompletedBookings)

    return matchesSearch && matchesBookingFilter
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    totalRevenue: users.reduce((sum, u) => sum + u.totalSpent, 0),
    avgSpentPerUser: users.reduce((sum, u) => sum + u.totalSpent, 0) / users.length,
  }

  const getInitials = (name : string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-muted-foreground">Manage and track all registered users</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Spent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(stats.avgSpentPerUser)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={bookingFilter} onValueChange={setBookingFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by bookings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="with-bookings">With Bookings</SelectItem>
                <SelectItem value="no-bookings">No Bookings</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <ExportDropdown
          onExport={(format) => ExportService.exportUsersData(filteredUsers, format)}
          label="Export Users"
        /> */}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Complete list of registered users and their activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Total Bookings</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user.totalBookings}</span>
                      <span className="text-sm text-muted-foreground">bookings</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">${user.totalSpent}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
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
