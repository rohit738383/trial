"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
  theme={theme as ToasterProps["theme"]}
  toastOptions={{
    classNames: {
      toast: "!bg-green-600 text-white border border-green-700", // default toast
      success: "!bg-green-600 text-white border border-green-700",
      error: "!bg-red-600 text-white border border-red-700",
      warning: "!bg-yellow-500 text-black border border-yellow-600",
      info: "!bg-blue-500 text-white border border-blue-600",
    },
  }}
  {...props}
/>
  )
}

export { Toaster }
