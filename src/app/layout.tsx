import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "Site Library | Digital Official",
  description: "Browse our portfolio of website designs. Built by Digital Official — Tucson's full-service digital marketing agency.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-void text-ink antialiased">{children}</body>
    </html>
  );
}
