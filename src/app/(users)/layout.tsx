import type { Metadata } from "next";
import { Navigation } from "@/app/(users)/components/Navigation";
import Footer from "@/app/(users)/components/Footer";
import ScrollingBanner from "./components/Scrolling-banner";

export const metadata: Metadata = {
  title: "Studytainment",
  description: "Studytainment",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <ScrollingBanner />
      {children}
      <Footer />
    </>
  );
}
