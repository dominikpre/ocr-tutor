import type { Metadata } from "next";
import Link from "next/link";

import { buttonClassName } from "@/ui/button";

import "./globals.css";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/upload", label: "Upload" },
  { href: "/submissions", label: "Submissions" },
] as const;

export const metadata: Metadata = {
  title: {
    default: "OCRTutor",
    template: "%s | OCRTutor",
  },
  description: "Minimal frontend for handwritten uploads and review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6">
          <header className="mb-8 border-b border-border pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Link href="/" className="text-lg font-semibold">
                  OCRTutor
                </Link>
                <p className="mt-1 text-sm text-muted">
                  Minimal handwritten review frontend
                </p>
              </div>

              <nav className="flex flex-wrap gap-2">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={buttonClassName({
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
