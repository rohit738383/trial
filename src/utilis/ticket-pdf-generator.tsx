import jsPDF from "jspdf"

interface Ticket {
  ticketCode: string
}

interface Seminar {
  id: number
  title: string
  date: string
  time: string
  location: string
  tickets: Ticket[]
}

export const generateSeminarTicketsPDF = (seminar: Seminar) => {
  const doc = new jsPDF()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
    return date.toLocaleDateString("en-IN", options)
  }

  // Colors matching the website
  const primaryBlue = [59, 130, 246] // blue-600
  const primaryPurple = [147, 51, 234] // purple-600
  const grayText = [75, 85, 99] // gray-600
  const darkText = [17, 24, 39] // gray-900
  const lightGray = [249, 250, 251] // gray-50
  const borderGray = [229, 231, 235] // gray-200

  // Header section with gradient-like effect
  doc.setFillColor(59, 130, 246) // blue-600
  doc.rect(0, 0, 210, 40, "F")

  // Title
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(seminar.title, 20, 20)

  // Speaker
  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")


  // Ticket count badge (top right)
  doc.setFillColor(255, 255, 255, 0.2)
  doc.roundedRect(150, 10, 40, 8, 2, 2, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.text(`${seminar.tickets.length} Tickets`, 152, 16)

  // Main content area background
  doc.setFillColor(255, 255, 255)
  doc.rect(0, 40, 210, 257, "F")

  // Seminar details section
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text("Seminar Details", 20, 60)

  // Date
  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  doc.text("Date:", 20, 75)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(grayText[0], grayText[1], grayText[2])
  doc.text(formatDate(seminar.date), 40, 75)

  // Time
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  doc.text("Time:", 20, 88)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(grayText[0], grayText[1], grayText[2])
  doc.text(seminar.time, 40, 88)

  // Location
  doc.setFont("helvetica", "bold")
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  doc.text("Location:", 20, 101)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(grayText[0], grayText[1], grayText[2])
  doc.text(seminar.location, 20, 108)

  // Tickets section
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
  doc.roundedRect(15, 120, 180, 120, 3, 3, "F")

  // Tickets header
  doc.setTextColor(darkText[0], darkText[1], darkText[2])
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text(`Ticket Codes (${seminar.tickets.length})`, 25, 135)

  // Tickets grid
  const ticketsPerRow = 2
  const ticketWidth = 80
  const ticketHeight = 15
  const startX = 25
  const startY = 145

  seminar.tickets.forEach((ticket, index) => {
    const row = Math.floor(index / ticketsPerRow)
    const col = index % ticketsPerRow
    const x = startX + col * 85
    const y = startY + row * 20

    // Check if we need a new page
    if (y > 225) {
      doc.addPage()

      // Repeat header on new page
      doc.setFillColor(59, 130, 246)
      doc.rect(0, 0, 210, 25, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text(`${seminar.title} - Tickets (Continued)`, 20, 15)

      // Reset background
      doc.setFillColor(255, 255, 255)
      doc.rect(0, 25, 210, 272, "F")

      // Continue tickets from top of new page
      const newY = 40 + (row - Math.floor((225 - startY) / 20)) * 20

      // Ticket background
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
      doc.roundedRect(x, newY, ticketWidth, ticketHeight, 2, 2, "FD")

      // Ticket number
      doc.setTextColor(grayText[0], grayText[1], grayText[2])
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text(`Ticket #${index + 1}`, x + 3, newY + 6)

      // Ticket code
      doc.setTextColor(147, 51, 234) // purple-600
      doc.setFontSize(9)
      doc.setFont("courier", "bold")
      doc.text(ticket.ticketCode, x + 3, newY + 12)
    } else {
      // Ticket background
      doc.setFillColor(255, 255, 255)
      doc.setDrawColor(borderGray[0], borderGray[1], borderGray[2])
      doc.roundedRect(x, y, ticketWidth, ticketHeight, 2, 2, "FD")

      // Ticket number
      doc.setTextColor(grayText[0], grayText[1], grayText[2])
      doc.setFontSize(8)
      doc.setFont("helvetica", "normal")
      doc.text(`Ticket #${index + 1}`, x + 3, y + 6)

      // Ticket code
      doc.setTextColor(147, 51, 234) // purple-600
      doc.setFontSize(9)
      doc.setFont("courier", "bold")
      doc.text(ticket.ticketCode, x + 3, y + 12)
    }
  })

  // Important note section (like the blue box on website)
  const noteY = Math.min(255, 145 + Math.ceil(seminar.tickets.length / ticketsPerRow) * 20 + 20)
  doc.setFillColor(239, 246, 255) // blue-50
  doc.setDrawColor(191, 219, 254) // blue-200
  doc.roundedRect(15, noteY, 180, 20, 3, 3, "FD")

  doc.setTextColor(30, 64, 175) // blue-800
  doc.setFontSize(9)
  doc.setFont("helvetica", "bold")
  doc.text("Important:", 20, noteY + 8)
  doc.setFont("helvetica", "normal")
  doc.text("Seminar attend karne ke liye ticket code aur valid ID card zaroor leke aayiye.", 20, noteY + 15)

  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(grayText[0], grayText[1], grayText[2])
    doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, 20, 290)
    doc.text(`Page ${i} of ${pageCount}`, 190, 290, { align: "right" })
  }

  // Download with clean filename
  const fileName = `${seminar.title.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_")}_Tickets.pdf`
  doc.save(fileName)
}
