import type React from "react";
import type { Metadata } from "next";
import "./admin.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/(admin-panel)/components/app-sidebar";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin panel for managing seminars and bookings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
