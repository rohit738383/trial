"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Search,
  Users,
  Filter,
  Eye,
  User,
  Phone,
  Calendar,
  BookOpen,
  MapPin,
  GraduationCap,
  Heart,
  Baby,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/lib/axiosInstance"

interface UserInterface {
  id: number
  fullName: string
  phoneNumber: string
  createdAt: string
  profile?: {
    id: number
    address: string
    city: string
    state: string
    zipCode: string
    highestEducation: string
    relationToChild: string
    counterpartnerName: string
    counterpartnerPhoneNumber: string
    counterpartnerEducation: string
  }
  children: Array<{
    id: number
    name: string
    age: number
    className: string
    gender: string
    createdAt: string
  }>
  _count: {
    bookings: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserInterface[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [bookingFilter, setBookingFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null)
  const itemsPerPage = 5

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/api/admin-users")
      const data = await response.data

      if (data.success) {
        setUsers(data.data)
      } else {
        console.error("Failed to fetch users:", data.message)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBookingFilter =
      bookingFilter === "all" ||
      (bookingFilter === "with-bookings" && user._count.bookings > 0) ||
      (bookingFilter === "no-bookings" && user._count.bookings === 0)

    return matchesSearch && matchesBookingFilter
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4 md:p-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Users Management</h1>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    )
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

      {/* Stats Card */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 max-w-xs">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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
                <TableHead>Phone Number</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Total Bookings</TableHead>
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
                        <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{user.phoneNumber}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{user._count.bookings}</span>
                      <span className="text-sm text-muted-foreground">bookings</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            User Details - {user.fullName}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Basic Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Basic Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Full Name:</span>
                                <span>{user.fullName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Phone:</span>
                                <span>{user.phoneNumber}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Join Date:</span>
                                <span>{formatDate(user.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">Total Bookings:</span>
                                <Badge variant="secondary">{user._count.bookings}</Badge>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Profile Information */}
                          {user.profile && (
                            <div>
                              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Profile Information
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <span className="font-medium">Address:</span>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {user.profile.address}, {user.profile.city}, {user.profile.state}{" "}
                                    {user.profile.zipCode}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Education:</span>
                                  <span>{user.profile.highestEducation}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Heart className="h-4 w-4 text-muted-foreground" />
                                  <span className="font-medium">Relation to Child:</span>
                                  <span>{user.profile.relationToChild}</span>
                                </div>
                                {user.profile.counterpartnerName && (
                                  <>
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Partner Name:</span>
                                      <span>{user.profile.counterpartnerName}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Partner Phone:</span>
                                      <span>{user.profile.counterpartnerPhoneNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                      <span className="font-medium">Partner Education:</span>
                                      <span>{user.profile.counterpartnerEducation}</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          )}

                          <Separator />

                          {/* Children Information */}
                          <div>
                            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                              <Baby className="h-4 w-4" />
                              Children ({user.children.length})
                            </h3>
                            {user.children.length > 0 ? (
                              <div className="grid gap-4">
                                {user.children.map((child) => (
                                  <Card key={child.id} className="p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                      <div>
                                        <span className="font-medium">Name:</span>
                                        <p className="text-sm text-muted-foreground">{child.name}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Age:</span>
                                        <p className="text-sm text-muted-foreground">{child.age} years</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Class:</span>
                                        <p className="text-sm text-muted-foreground">{child.className}</p>
                                      </div>
                                      <div>
                                        <span className="font-medium">Gender:</span>
                                        <Badge variant="outline">{child.gender}</Badge>
                                      </div>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No children registered</p>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
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
