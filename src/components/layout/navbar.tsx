"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function toggleLocale() {
    const nextLocale = locale === "en" ? "zh" : "en";
    // Replace the locale prefix in the current path
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F5EEE6] bg-[#FFF8F2]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2">
          <span className="text-2xl">🎂</span>
          <span className="text-lg font-bold text-[#FF6B8A]">BirthdayVid</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link href={`/${locale}#how-it-works`} className="text-sm text-[#5A4E6A] hover:text-[#FF6B8A] transition-colors">
            {t("howItWorks")}
          </Link>
          <Link href={`/${locale}#categories`} className="text-sm text-[#5A4E6A] hover:text-[#FF6B8A] transition-colors">
            {t("home")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-[#5A4E6A] hover:bg-[#FF6B8A]/10 transition-colors"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{locale === "en" ? "中文" : "EN"}</span>
          </button>
          <Button size="sm" variant="outline">
            {t("signIn")}
          </Button>
          <Button size="sm" className="hidden sm:inline-flex">
            {t("myOrders")}
          </Button>
        </div>
      </div>
    </header>
  );
}
