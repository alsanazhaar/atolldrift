import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "AtollDrift Maldives",
  description:
    "Authentic small-group journeys and local experiences across the three southern atolls of the Maldives — Huvadhu, Fuvahmulah, and Addu.",
  keywords: ["Maldives", "Huvadhu", "Fuvahmulah", "Addu", "authentic travel", "southern Maldives"],
  openGraph: {
    title: "AtollDrift Maldives",
    description: "Group journeys and local experiences. Huvadhu, Fuvahmulah, and Addu.",
    siteName: "AtollDrift",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
