import jsPDF from "jspdf"
import "jspdf-autotable"

// Extend jsPDF type to include autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF
  }
}

export interface ExportData {
  headers: string[]
  rows: (string | number)[][]
  title: string
  filename: string
}

export class ExportService {
  // CSV Export
  static exportToCSV(data: ExportData): void {
    const { headers, rows, filename } = data

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            // Escape quotes and wrap in quotes if contains comma
            const cellStr = String(cell)
            if (cellStr.includes(",") || cellStr.includes('"') || cellStr.includes("\n")) {
              return `"${cellStr.replace(/"/g, '""')}"`
            }
            return cellStr
          })
          .join(","),
      ),
    ].join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `${filename}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // PDF Export
  static exportToPDF(data: ExportData): void {
    const { headers, rows, title, filename } = data

    const doc = new jsPDF()

    // Add title
    doc.setFontSize(20)
    doc.text(title, 20, 20)

    // Add generation date
    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30)

    // Add table
    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 40,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 40 },
    })

    // Save the PDF
    doc.save(`${filename}.pdf`)
  }

  // Export seminars data
  static exportSeminarsData(seminars: any[], format: "csv" | "pdf"): void {
    const headers = ["Title", "Instructor", "Date", "Time", "Duration", "Price", "Capacity", "Enrolled", "Status"]

    const rows = seminars.map((seminar) => [
      seminar.title,
      seminar.instructor,
      seminar.date,
      seminar.time,
      seminar.duration,
      `$${seminar.price}`,
      seminar.capacity,
      seminar.enrolled,
      seminar.status,
    ])

    const exportData: ExportData = {
      headers,
      rows,
      title: "Seminars Report",
      filename: `seminars-report-${new Date().toISOString().split("T")[0]}`,
    }

    if (format === "csv") {
      this.exportToCSV(exportData)
    } else {
      this.exportToPDF(exportData)
    }
  }

  // Export bookings data
  static exportBookingsData(bookings: any[], format: "csv" | "pdf"): void {
    const headers = [
      "Booking ID",
      "User Name",
      "User Email",
      "Seminar Title",
      "Seminar Date",
      "Booking Date",
      "Amount",
      "Payment Method",
      "Status",
    ]

    const rows = bookings.map((booking) => [
      booking.bookingId,
      booking.userName,
      booking.userEmail,
      booking.seminarTitle,
      booking.seminarDate,
      booking.bookingDate,
      `$${booking.amount}`,
      booking.paymentMethod,
      booking.status,
    ])

    const exportData: ExportData = {
      headers,
      rows,
      title: "Bookings Report",
      filename: `bookings-report-${new Date().toISOString().split("T")[0]}`,
    }

    if (format === "csv") {
      this.exportToCSV(exportData)
    } else {
      this.exportToPDF(exportData)
    }
  }

  // Export users data
  static exportUsersData(users: any[], format: "csv" | "pdf"): void {
    const headers = ["Name", "Email", "Join Date", "Total Bookings", "Total Spent", "Last Login", "Status"]

    const rows = users.map((user) => [
      user.name,
      user.email,
      user.joinDate,
      user.totalBookings,
      `$${user.totalSpent}`,
      user.lastLogin,
      user.status,
    ])

    const exportData: ExportData = {
      headers,
      rows,
      title: "Users Report",
      filename: `users-report-${new Date().toISOString().split("T")[0]}`,
    }

    if (format === "csv") {
      this.exportToCSV(exportData)
    } else {
      this.exportToPDF(exportData)
    }
  }

  // Export inquiries data
  static exportInquiriesData(inquiries: any[], format: "csv" | "pdf"): void {
    const headers = [
      "Full Name",
      "Email",
      "Phone Number",
      "Inquiry Type",
      "Subject",
      "Message",
      "Status",
      "Date Submitted",
    ]

    const rows = inquiries.map((inquiry) => [
      inquiry.fullName,
      inquiry.email,
      inquiry.phoneNumber,
      inquiry.inquiryType,
      inquiry.subject,
      inquiry.message,
      inquiry.status.replace("-", " "),
      inquiry.createdAt,
    ])

    const exportData: ExportData = {
      headers,
      rows,
      title: "Inquiries Report",
      filename: `inquiries-report-${new Date().toISOString().split("T")[0]}`,
    }

    if (format === "csv") {
      this.exportToCSV(exportData)
    } else {
      this.exportToPDF(exportData)
    }
  }
}
