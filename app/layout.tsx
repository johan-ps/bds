import type { Metadata } from "next";
import { Syne, Urbanist } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { SiteFooter } from "./components/layout/SiteFooter";
import { SiteHeader } from "./components/layout/SiteHeader";
import { StudioProvider } from "./components/providers/StudioProvider";
import { InlineStudioEditor } from "./components/site/InlineStudioEditor";
import { RevealObserver } from "./components/ui/RevealObserver";

const bodyFont = Urbanist({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "Bollyfit Dance Studio",
  description:
    "Bollyfit Dance Studio is a modern cultural dance school offering Bollywood, Kuthu, Hiphop, Contemporary, and Fusion training with classes, events, gallery, and admin-managed content.",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "64x64" }],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${displayFont.variable} antialiased`}>
        <StudioProvider>
          <div className="app-shell">
            <RevealObserver />
            <SiteHeader />
            <main className="page">{children}</main>
            <InlineStudioEditor />
            <SiteFooter />
          </div>
        </StudioProvider>
      </body>
    </html>
  );
}
