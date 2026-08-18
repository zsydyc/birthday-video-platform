import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/layout/navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Clock, Share2 } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const categories = [
    {
      key: "toddler",
      emoji: "🧸",
      gradient: "from-[#FFB3C4] to-[#FFCF56]",
      badge: "yellow" as const,
    },
    {
      key: "kids",
      emoji: "🦸",
      gradient: "from-[#60C8FF] to-[#6ECFAF]",
      badge: "sky" as const,
    },
    {
      key: "adultFun",
      emoji: "🎉",
      gradient: "from-[#6ECFAF] to-[#60C8FF]",
      badge: "mint" as const,
    },
    {
      key: "pet",
      emoji: "🐾",
      gradient: "from-[#FFCF56] to-[#FF6B8A]",
      badge: "coral" as const,
    },
  ] as const;

  const steps = [
    { key: "step1", icon: <Sparkles className="h-7 w-7 text-[#FF6B8A]" /> },
    { key: "step2", icon: <Clock className="h-7 w-7 text-[#60C8FF]" /> },
    { key: "step3", icon: <Share2 className="h-7 w-7 text-[#6ECFAF]" /> },
  ] as const;

  return (
    <div className="flex min-h-screen flex-col bg-[#FFF8F2]">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-20 sm:py-28 md:py-36">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#FF6B8A]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-[#60C8FF]/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl text-center">
          <Badge variant="coral" className="mb-6 text-sm px-4 py-1">
            {t("hero.badge")}
          </Badge>

          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-[#2D2235] sm:text-6xl md:text-7xl">
            {t("hero.headline")}{" "}
            <span className="bg-gradient-to-r from-[#FF6B8A] to-[#60C8FF] bg-clip-text text-transparent">
              {t("hero.headlineAccent")}
            </span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg leading-relaxed text-[#5A4E6A] sm:text-xl">
            {t("hero.subheadline")}
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={`/${locale}/order`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B8A] px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-[#E84D6F] active:scale-95"
            >
              {t("hero.ctaFree")}
            </Link>
            <Link
              href={`/${locale}/order`}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-[#FF6B8A] bg-transparent px-8 py-4 text-lg font-semibold text-[#FF6B8A] transition-all hover:bg-[#FF6B8A]/10 active:scale-95"
            >
              {t("hero.cta")}
            </Link>
          </div>

          <p className="mt-8 text-sm text-[#8B7DA0]">
            ✨ {t("hero.trustedBy")}
          </p>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────── */}
      <section id="categories" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[#2D2235] sm:text-4xl">
              {t("categories.title")}
            </h2>
            <p className="text-[#5A4E6A]">{t("categories.subtitle")}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map(({ key, emoji, gradient, badge }) => (
              <Card key={key} hover>
                <CardContent className="flex flex-col items-center text-center gap-4 py-8">
                  <div
                    className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} text-4xl shadow-sm`}
                  >
                    {emoji}
                  </div>
                  <Badge variant={badge}>
                    {t(`categories.${key}.age`)}
                  </Badge>
                  <h3 className="text-lg font-bold text-[#2D2235]">
                    {t(`categories.${key}.label`)}
                  </h3>
                  <p className="text-sm leading-relaxed text-[#5A4E6A]">
                    {t(`categories.${key}.description`)}
                  </p>
                  <Link
                    href={`/${locale}/order`}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-transparent px-4 py-2 text-sm font-medium text-[#FF6B8A] transition-all hover:bg-[#FF6B8A]/10 active:scale-95"
                  >
                    →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-[#2D2235] sm:text-4xl">
              {t("howItWorks.title")}
            </h2>
            <p className="text-[#5A4E6A]">{t("howItWorks.subtitle")}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map(({ key, icon }, i) => (
              <div key={key} className="flex flex-col items-center text-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFF8F2]">
                  {icon}
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF6B8A] text-xs font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#2D2235]">
                  {t(`howItWorks.${key}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-[#5A4E6A]">
                  {t(`howItWorks.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl rounded-3xl bg-gradient-to-br from-[#FF6B8A] to-[#60C8FF] p-1 shadow-lg">
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-[#FFF8F2] px-8 py-12 text-center">
            <span className="text-5xl">🎈</span>
            <h2 className="text-2xl font-bold text-[#2D2235] sm:text-3xl">
              {t("cta.title")}
            </h2>
            <p className="text-[#5A4E6A]">{t("cta.subtitle")}</p>
            <Link
              href={`/${locale}/order`}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#FF6B8A] px-8 py-4 text-lg font-semibold text-white shadow-md transition-all hover:bg-[#E84D6F] active:scale-95"
            >
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[#F5EEE6] bg-white px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-[#8B7DA0] sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎂</span>
            <span className="font-semibold text-[#FF6B8A]">BirthdayVid</span>
            <span className="hidden sm:inline">— {t("footer.tagline")}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#FF6B8A] transition-colors">{t("footer.privacy")}</a>
            <a href="#" className="hover:text-[#FF6B8A] transition-colors">{t("footer.terms")}</a>
            <a href="#" className="hover:text-[#FF6B8A] transition-colors">{t("footer.contact")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
