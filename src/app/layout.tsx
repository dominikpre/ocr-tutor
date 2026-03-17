import type { Metadata } from "next";

import { SiteNavbar } from "@/components/site-navbar";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "OCRTutor",
    template: "%s | OCRTutor",
  },
  description: "Minimal OCRTutor handwriting scaffold.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="relative min-h-screen">
          <SiteNavbar />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
