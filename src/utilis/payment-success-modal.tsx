"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface PaymentSuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PaymentSuccessModal({ isOpen, onClose }: PaymentSuccessModalProps) {
  const router = useRouter()

  useEffect(() => {
    console.log("Modal isOpen state changed:", isOpen)
  }, [isOpen])

  const handleSeeTickets = () => {
    console.log("See tickets clicked")
    onClose()
    router.push("/services/your-seminar") 
  }

  console.log("Modal rendering with isOpen:", isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">Thank You!</DialogTitle>
          <DialogDescription className="text-base">
            Your seminar booking has been confirmed successfully. You can view your ticket details anytime.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-col">
          <Button onClick={handleSeeTickets} className="w-full">
            See Your Tickets
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full bg-transparent">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
