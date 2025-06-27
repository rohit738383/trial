"use client"

import { useState , useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, MessageSquare, Phone, Mail, Clock, CheckCircle, AlertCircle, Edit } from "lucide-react"
// import { ExportDropdown } from "@/app/(admin-panel)/components/export-dropdown"
// import { ExportService } from "@/lib/export-inquiry"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axiosInstance from "@/lib/axiosInstance"
import * as z from "zod"
import { inquirySchema } from "@/schemas/inquirySchema"

const inquiryTypes = [
  "General Information",
  "Seminar Booking",
  "Technical Support",
  "Payment Issues",
  "Partnership Opportunities",
  "Career Opportunities",
  "Feedback & Suggestions",
] as const;

type InquiryType = typeof inquiryTypes[number]

type InquiryStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED"

type Inquiry = z.infer<typeof inquirySchema> & {
  status: InquiryStatus;
};




export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [tempStatus, setTempStatus] = useState<InquiryStatus | null>(null)
  const itemsPerPage = 5


  useEffect(()=>{
    const fetchinquiries = async () =>{
     try {
       const res = await axiosInstance.get("/inquiry")
       const inquiries = Array.isArray(res.data) ? res.data : []
       setInquiries(inquiries);
     } catch (error) {
      console.error("Error fetching inquiries:", error)
     }
    }
    fetchinquiries();
 },[]) 


  const filteredInquiries = inquiries.filter((inquiry) => {
    const matchesSearch = inquiry.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = typeFilter === "all" || inquiry.inquiryType === typeFilter
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter

    return matchesSearch && matchesType && matchesStatus
  })

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedInquiries = filteredInquiries.slice(startIndex, endIndex)
  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage)

  const stats = {
    total: inquiries.length,
    pending: inquiries.filter((i) => i.status === "PENDING").length,
    inProgress: inquiries.filter((i) => i.status === "IN_PROGRESS").length,
    resolved: inquiries.filter((i) => i.status === "RESOLVED").length,
  }

  const getStatusIcon = (status : string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "pending":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusVariant = (status : string) => {
    switch (status) {
      case "resolved":
        return "default"
      case "in-progress":
        return "secondary"
      case "pending":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getInquiryTypeColor = (type : InquiryType) => {
    const colors = {
      "General Information": "bg-blue-100 text-blue-800",
      "Seminar Booking": "bg-green-100 text-green-800",
      "Technical Support": "bg-red-100 text-red-800",
      "Payment Issues": "bg-yellow-100 text-yellow-800",
      "Partnership Opportunities": "bg-purple-100 text-purple-800",
      "Career Opportunities": "bg-indigo-100 text-indigo-800",
      "Feedback & Suggestions": "bg-pink-100 text-pink-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const handleStatusUpdate = async () => {
    if (!selectedInquiry || !tempStatus) return;
    
    try {
      await axiosInstance.put(`/inquiry/${selectedInquiry.id}`, {
        status: tempStatus
      });
      
      // Update local state
      setInquiries(inquiries.map(inquiry => 
        inquiry.id === selectedInquiry.id 
          ? { ...inquiry, status: tempStatus }
          : inquiry
      ));
      
      setSelectedInquiry({ ...selectedInquiry, status: tempStatus });
      setIsEditing(false);
      setTempStatus(null);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Inquiries Management</h1>
          <p className="text-muted-foreground">Track and manage customer inquiries</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[250px]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {inquiryTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* <ExportDropdown
          onExport={(format) => ExportService.exportInquiriesData(filteredInquiries, format)}
          label="Export Inquiries"
        /> */}
      </div>

      {/* Inquiries Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
          <CardDescription>Complete list of customer inquiries and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact Info</TableHead>
                <TableHead>Inquiry Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInquiries.map((inquiry) => (
                <TableRow key={inquiry.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{inquiry.fullName}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {inquiry.email}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {inquiry.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getInquiryTypeColor(inquiry.inquiryType)} border-0`}>
                      {inquiry.inquiryType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <div className="font-medium truncate">{inquiry.subject}</div>
                      <div className="text-sm text-muted-foreground truncate">{inquiry.message}</div>
                    </div>
                  </TableCell>
                  <TableCell>{inquiry.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(inquiry.status)}
                      <Badge variant={getStatusVariant(inquiry.status)}>{inquiry.status.replace("-", " ")}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedInquiry(inquiry)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Inquiry Details</DialogTitle>
                          <DialogDescription>Complete information about the customer inquiry</DialogDescription>
                        </DialogHeader>
                        {selectedInquiry && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Full Name</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.fullName}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Email</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.email}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Phone Number</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.phoneNumber}</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Inquiry Type</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.inquiryType}</p>
                              </div>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Subject</label>
                              <p className="text-sm text-muted-foreground">{selectedInquiry.subject}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Message</label>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {selectedInquiry.message}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <div className="flex items-center gap-2 mt-1 pt-7">
                                  {getStatusIcon(selectedInquiry.status)}
                                  {isEditing ? (
                                    <div className="flex items-center gap-2 ">
                                      <Select
                                        defaultValue={selectedInquiry.status}
                                        onValueChange={(value: InquiryStatus) => setTempStatus(value)}
                                      >
                                        <SelectTrigger className="w-[180px]">
                                          <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="PENDING">Pending</SelectItem>
                                          <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <Button 
                                        variant="default" 
                                        size="sm"
                                        onClick={handleStatusUpdate}
                                        disabled={!tempStatus || tempStatus === selectedInquiry.status}
                                      >
                                        Submit
                                      </Button>
                                    </div>
                                  ) : (
                                    <Badge variant={getStatusVariant(selectedInquiry.status)}>
                                      {selectedInquiry.status.replace("-", " ")}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Date Submitted</label>
                                <p className="text-sm text-muted-foreground">{selectedInquiry.createdAt}</p>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setIsEditing(!isEditing);
                                  setTempStatus(null);
                                }}
                                className="flex items-center gap-2"
                              >
                                <Edit className="h-4 w-4" />
                                {isEditing ? "Cancel" : "Edit Status"}
                              </Button>
                            </div>
                          </div>
                        )}
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
          Showing {startIndex + 1} to {Math.min(endIndex, filteredInquiries.length)} of {filteredInquiries.length}{" "}
          results
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
