"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ExportDropdownProps {
  onExport: (format: "csv" | "pdf") => void
  disabled?: boolean
  label?: string
}

export function ExportDropdown({ onExport, disabled = false, label = "Export" }: ExportDropdownProps) {
  const [isExporting, setIsExporting] = useState(false)


  const handleExport = async (format: "csv" | "pdf") => {
    setIsExporting(true)
    try {
      await onExport(format)
      toast.success("Export successful",{
        description: `Data exported as ${format.toUpperCase()} file`,
      })
    } catch (error) {
        toast.error("Export failed",{
            description: `Data exported as ${format.toUpperCase()} file`,
          })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting}>
          {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
