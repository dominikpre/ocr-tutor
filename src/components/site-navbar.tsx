import Link from "next/link";

import { ContentContainer } from "@/components/content-container";
import { controlClassName } from "@/components/control-styles";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/upload", label: "Upload" },
  { href: "/documents", label: "Review" },
] as const;

export function SiteNavbar() {
  return (
    <header className="border-b border-border bg-white">
      <ContentContainer className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="text-base font-semibold">
          OCRTutor
        </Link>

        <nav className="flex flex-wrap gap-2">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={controlClassName("text-muted")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </ContentContainer>
    </header>
  );
}
