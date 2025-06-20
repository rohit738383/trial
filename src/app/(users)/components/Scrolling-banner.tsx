"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ScrollingBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  const handleBannerClick = () => {
    router.push("/seminars") 
  }

  if (!isVisible) return null

  return (
    <div className="h-[47px] relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div
          className="flex-1 overflow-hidden cursor-pointer hover:bg-white/10 transition-colors rounded-md"
          onClick={handleBannerClick}
        >
          <div className="animate-marquee whitespace-nowrap py-1">
            <span className="text-sm md:text-base font-semibold mx-8">
              🎉 Join Our Exclusive Seminar - Get 10% OFF Limited Time Offer!
            </span>
            <span className="text-sm md:text-base font-semibold mx-8">
              📚 Learn from Industry Experts - Register Now!
            </span>
            <span className="text-sm md:text-base font-semibold mx-8">⚡ Don't Miss Out - Only Few Seats Left!</span>
            <span className="text-sm md:text-base font-semibold mx-8">
              🎉 Join Our Exclusive Seminar - Get 10% OFF Limited Time Offer!
            </span>
            <span className="text-sm md:text-base font-semibold mx-8">
              📚 Learn from Industry Experts - Register Now!
            </span>
            <span className="text-sm md:text-base font-semibold mx-8">⚡ Don't Miss Out - Only Few Seats Left!</span>
          </div>
        </div>
        {/* <button
          onClick={() => setIsVisible(false)}
          className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close banner"
        >
          <X className="h-4 w-4" />
        </button> */}
      </div>
    </div>
  )
}
