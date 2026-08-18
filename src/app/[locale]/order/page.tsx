"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Category = "toddler" | "kids" | "adult_fun" | "pet";

interface Template {
  id: string;
  name: string;
  description: string | null;
  occasionTags: string[];
  durationTier: "short" | "medium";
  category: Category;
}

const CATEGORY_CONFIG: Record<
  Category,
  { emoji: string; color: string; bg: string }
> = {
  toddler: { emoji: "🌈", color: "text-[#FFCF56]", bg: "bg-[#FFCF56]/10 hover:bg-[#FFCF56]/20" },
  kids: { emoji: "⚡", color: "text-[#60C8FF]", bg: "bg-[#60C8FF]/10 hover:bg-[#60C8FF]/20" },
  adult_fun: { emoji: "🎉", color: "text-[#FF6B8A]", bg: "bg-[#FF6B8A]/10 hover:bg-[#FF6B8A]/20" },
  pet: { emoji: "🐾", color: "text-[#6ECFAF]", bg: "bg-[#6ECFAF]/10 hover:bg-[#6ECFAF]/20" },
};

export default function OrderPage() {
  const t = useTranslations("orderFlow");
  const tc = useTranslations("categories");
  const tf = useTranslations("orderFlow.form");
  const locale = useLocale();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedCategory) return;
    setLoading(true);
    fetch(`/api/templates?category=${selectedCategory}`)
      .then((r) => r.json())
      .then((data) => setTemplates(data))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const categories: Category[] = ["toddler", "kids", "adult_fun", "pet"];

  return (
    <main className="min-h-screen bg-[#FFF8F2] px-4 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <Badge className="mb-3 bg-[#FF6B8A]/10 text-[#FF6B8A]">
            {t("freeBadge")}
          </Badge>
          <h1 className="text-3xl font-bold text-[#2D2235] sm:text-4xl">
            {t("pageTitle")}
          </h1>
        </div>

        {/* Step 1 — Category */}
        {!selectedCategory && (
          <section>
            <h2 className="mb-2 text-center text-xl font-semibold text-[#2D2235]">
              {t("selectCategory.title")}
            </h2>
            <p className="mb-8 text-center text-[#2D2235]/60">
              {t("selectCategory.subtitle")}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {categories.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const catKey = cat === "adult_fun" ? "adultFun" : cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-2xl p-6 text-center transition-all duration-200 active:scale-95 cursor-pointer ${cfg.bg}`}
                  >
                    <div className="mb-3 text-4xl">{cfg.emoji}</div>
                    <div className={`font-semibold ${cfg.color}`}>
                      {tc(`${catKey}.label`)}
                    </div>
                    <div className="mt-1 text-xs text-[#2D2235]/50">
                      {tc(`${catKey}.age`)}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 2 — Templates */}
        {selectedCategory && (
          <section>
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setTemplates([]);
                }}
                className="text-sm text-[#FF6B8A] hover:underline flex items-center gap-1"
              >
                ← {t("selectTemplate.back")}
              </button>
              <span className="text-[#2D2235]/30">|</span>
              <h2 className="text-lg font-semibold text-[#2D2235]">
                {t("selectTemplate.title")}
              </h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-16">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-[#FF6B8A] border-t-transparent" />
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {templates.map((tpl) => (
                  <Card key={tpl.id} hover>
                    <CardContent className="flex flex-col gap-3">
                      {/* Placeholder preview */}
                      <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF6B8A]/10 to-[#60C8FF]/10 text-4xl">
                        {CATEGORY_CONFIG[selectedCategory].emoji}
                      </div>

                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-[#2D2235]">
                            {tpl.name}
                          </span>
                          <Badge className="shrink-0 bg-[#6ECFAF]/15 text-[#3aaa87] text-xs">
                            {tpl.durationTier === "short"
                              ? t("selectTemplate.duration.short")
                              : t("selectTemplate.duration.medium")}
                          </Badge>
                        </div>
                        {tpl.description && (
                          <p className="mt-1 text-sm text-[#2D2235]/60">
                            {tpl.description}
                          </p>
                        )}
                      </div>

                      {tpl.occasionTags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tpl.occasionTags.map((tag) => {
                            const labelKey = tag === "birthday" ? "occasionBirthday"
                              : tag === "adoption" ? "occasionAdoption"
                              : tag === "graduation" ? "occasionGraduation"
                              : "occasionOther";
                            return (
                              <span
                                key={tag}
                                className="rounded-full bg-[#FFF8F2] px-2 py-0.5 text-xs text-[#2D2235]/50 border border-[#2D2235]/10"
                              >
                                {tf(labelKey)}
                              </span>
                            );
                          })}
                        </div>
                      )}

                      <Button
                        size="sm"
                        className="mt-auto w-full"
                        onClick={() =>
                          router.push(`/${locale}/order/${tpl.id}`)
                        }
                      >
                        {t("selectTemplate.select")}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
