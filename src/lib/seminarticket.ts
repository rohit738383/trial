const generateTicketCode = (seminarTitle: string) => {
    const prefix = seminarTitle.slice(0, 3).toUpperCase()
    const unique = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `${prefix}-${unique}` // e.g., SEM-AB12XY
  }
  