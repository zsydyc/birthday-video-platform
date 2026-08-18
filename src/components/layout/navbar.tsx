"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Globe, LogOut, Package, ChevronDown } from "lucide-react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  function toggleLocale() {
    const nextLocale = locale === "en" ? "zh" : "en";
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    router.push(segments.join("/"));
  }

  const isLoading = status === "loading";
  const isSignedIn = status === "authenticated";

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
          <Link
            href={`/${locale}#how-it-works`}
            className="text-sm text-[#5A4E6A] hover:text-[#FF6B8A] transition-colors"
          >
            {t("howItWorks")}
          </Link>
          <Link
            href={`/${locale}#categories`}
            className="text-sm text-[#5A4E6A] hover:text-[#FF6B8A] transition-colors"
          >
            {t("home")}
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Locale toggle */}
          <button
            onClick={toggleLocale}
            className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-[#5A4E6A] hover:bg-[#FF6B8A]/10 transition-colors"
            aria-label="Switch language"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {locale === "en" ? "中文" : "EN"}
            </span>
          </button>

          {/* Auth — loading skeleton */}
          {isLoading && (
            <div className="h-8 w-24 animate-pulse rounded-full bg-[#F5EEE6]" />
          )}

          {/* Auth — signed out */}
          {!isLoading && !isSignedIn && (
            <button
              onClick={() =>
                signIn("google", { callbackUrl: pathname })
              }
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#FF6B8A] px-4 py-1.5 text-sm font-medium text-[#FF6B8A] transition-all hover:bg-[#FF6B8A]/10 active:scale-95"
            >
              {t("signIn")}
            </button>
          )}

          {/* Auth — signed in */}
          {!isLoading && isSignedIn && (
            <div className="flex items-center gap-2">
              {/* My Orders */}
              <Link
                href={`/${locale}/orders`}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#FF6B8A] px-4 py-1.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#E84D6F] active:scale-95"
              >
                <Package className="h-3.5 w-3.5" />
                {t("myOrders")}
              </Link>

              {/* User avatar dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-[#F5EEE6] bg-white px-2 py-1 text-sm transition-all hover:border-[#FF6B8A]/30 hover:shadow-sm"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? ""}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B8A] text-xs font-bold text-white">
                      {(session.user?.name ?? "U")[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden max-w-[100px] truncate text-[#2D2235] sm:inline">
                    {session.user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-[#2D2235]/40" />
                </button>

                {dropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 z-20 mt-2 w-44 rounded-2xl border border-[#F5EEE6] bg-white py-1 shadow-lg">
                      <Link
                        href={`/${locale}/orders`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#2D2235] hover:bg-[#FFF8F2] sm:hidden"
                      >
                        <Package className="h-4 w-4 text-[#FF6B8A]" />
                        {t("myOrders")}
                      </Link>
                      <div className="mx-4 my-1 hidden border-t border-[#F5EEE6] sm:block" />
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut({ callbackUrl: `/${locale}` });
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-[#2D2235] hover:bg-[#FFF8F2]"
                      >
                        <LogOut className="h-4 w-4 text-[#2D2235]/50" />
                        {t("signOut")}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
