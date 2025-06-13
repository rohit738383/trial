import type { Metadata } from "next";
import { Navigation } from "./components/Navigation";

export const metadata: Metadata = {
  title: "Seminar CMS",
  description: "Seminar CMS",
};

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      {children}
    </>
  );
}
