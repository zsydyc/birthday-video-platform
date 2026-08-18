"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Category = "toddler" | "kids" | "adult_fun" | "pet";

interface Template {
  id: string;
  name: string;
  description: string | null;
  category: Category;
  occasionTags: string[];
  durationTier: "short" | "medium";
}

interface FormState {
  subjectName: string;
  age: string;
  birthday: string;
  occasion: string;
  blessingMessage: string;
  specialNotes: string;
  photoFiles: File[];
  voiceFiles: File[];
  // toddler extras
  favouriteColour: string;
  favouriteAnimal: string;
  bedtimeStory: boolean;
  storyTheme: string;
  // kids extras
  styleTag: string;
  // adult_fun extras
  performanceStyle: string;
  language: string;
  ageRatingAck: boolean;
  // pet extras
  petType: string;
  petName: string;
  personality: string;
  petOccasion: string;
  // consent
  coppaConsent: boolean;
  portraitConsent: boolean;
}

// Production defaults (swap back in before launch — replace the block below)
// const INITIAL: FormState = {
//   subjectName: "", age: "", birthday: "", occasion: "birthday",
//   blessingMessage: "", specialNotes: "", photoFiles: [], voiceFiles: [],
//   favouriteColour: "", favouriteAnimal: "", bedtimeStory: false, storyTheme: "",
//   styleTag: "", performanceStyle: "", language: "", ageRatingAck: false,
//   petType: "", petName: "", personality: "", petOccasion: "birthday",
//   coppaConsent: true, portraitConsent: true,
// };

// TODO: remove before launch — dummy data for testing
const INITIAL: FormState = {
  subjectName: "Sophie",
  age: "5",
  birthday: "2020-03-15",
  occasion: "birthday",
  blessingMessage: "Happy Birthday Sophie! Wishing you a magical day full of joy and laughter. You are so loved! 🎂",
  specialNotes: "She loves the colour pink and her favourite animal is a unicorn.",
  photoFiles: [],
  voiceFiles: [],
  favouriteColour: "Pink",
  favouriteAnimal: "Unicorn",
  bedtimeStory: true,
  storyTheme: "Ocean adventure with friendly dolphins",
  styleTag: "adventure",
  performanceStyle: "Heartfelt and fun",
  language: "",
  ageRatingAck: true,
  petType: "Dog",
  petName: "Buddy",
  personality: "Super energetic, loves fetch, always hungry, best cuddle buddy.",
  petOccasion: "birthday",
  coppaConsent: true,
  portraitConsent: true,
};

function needsCoppa(category: Category, age: string) {
  const n = parseInt(age, 10);
  return (category === "toddler" || category === "kids") && !isNaN(n) && n < 13;
}

export default function OrderFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: templateId } = use(params);
  const t = useTranslations("orderFlow.form");
  const tFlow = useTranslations("orderFlow");
  const locale = useLocale();
  const router = useRouter();

  const DRAFT_KEY = `order_draft_${templateId}`;

  const [template, setTemplate] = useState<Template | null>(null);
  const [form, setForm] = useState<FormState>(() => {
    // Restore draft saved before OAuth redirect, if any
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(`order_draft_${templateId}`);
        if (saved) return { ...INITIAL, ...JSON.parse(saved) };
      } catch {
        // ignore malformed draft
      }
    }
    return INITIAL;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftRestored, setDraftRestored] = useState(false);

  useEffect(() => {
    fetch(`/api/templates/${templateId}`)
      .then((r) => r.json())
      .then(setTemplate);
  }, [templateId]);

  // Show "draft restored" notice once if we loaded a saved draft
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) setDraftRestored(true);
  }, [DRAFT_KEY]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) return null;
    const { url } = await res.json() as { url: string };
    return url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!template) return;
    setSubmitting(true);
    setError(null);

    // Persist non-file fields before the OAuth redirect in case of 401
    const serializableForm = { ...form, photoFiles: [], voiceFiles: [] };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(serializableForm));

    try {
      // Upload all files in parallel, then attach URL arrays to the order
      const [photoUrls, voiceUrls] = await Promise.all([
        Promise.all(form.photoFiles.map(uploadFile)).then((urls) =>
          urls.filter(Boolean) as string[]
        ),
        Promise.all(form.voiceFiles.map(uploadFile)).then((urls) =>
          urls.filter(Boolean) as string[]
        ),
      ]);

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          formData: {
            subjectName: form.subjectName,
            age: form.age,
            birthday: form.birthday,
            occasion: form.occasion,
            blessingMessage: form.blessingMessage,
            specialNotes: form.specialNotes,
            // category extras
            favouriteColour: form.favouriteColour,
            favouriteAnimal: form.favouriteAnimal,
            bedtimeStory: form.bedtimeStory,
            storyTheme: form.storyTheme,
            styleTag: form.styleTag,
            performanceStyle: form.performanceStyle,
            language: form.language,
            petType: form.petType,
            petName: form.petName,
            personality: form.personality,
            petOccasion: form.petOccasion,
            // uploaded asset URL arrays (empty if nothing provided)
            photoUrls,
            voiceUrls,
          },
          coppaConsent: form.coppaConsent,
          portraitConsent: form.portraitConsent,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          router.push(`/api/auth/signin?callbackUrl=/${locale}/order`);
          return;
        }
        throw new Error(data.error || "Something went wrong");
      }

      const { orderId } = await res.json();
      localStorage.removeItem(DRAFT_KEY);
      router.push(`/${locale}/order/${orderId}/status`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFF8F2]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#FF6B8A] border-t-transparent" />
      </div>
    );
  }

  const showCoppa = needsCoppa(template.category, form.age);
  const showPortrait = form.photoFiles.length > 0;
  const canSubmit =
    form.subjectName.trim() &&
    form.blessingMessage.trim() &&
    (!showCoppa || form.coppaConsent) &&
    (!showPortrait || form.portraitConsent) &&
    (template.category !== "adult_fun" || form.ageRatingAck);

  return (
    <main className="min-h-screen bg-[#FFF8F2] px-4 py-12">
      <div className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 text-sm text-[#FF6B8A] hover:underline"
          >
            ← {t("back")}
          </button>

          {draftRestored && (
            <div className="mb-4 flex items-center justify-between rounded-xl bg-[#6ECFAF]/15 px-4 py-2.5 text-sm text-[#2a7a5e]">
              <span>✓ Your previously entered information has been restored.</span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem(DRAFT_KEY);
                  setDraftRestored(false);
                }}
                className="ml-3 text-xs underline opacity-70 hover:opacity-100"
              >
                Dismiss
              </button>
            </div>
          )}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#2D2235]">
              {template.name}
            </h1>
            <Badge className="bg-[#FF6B8A]/10 text-[#FF6B8A]">
              {tFlow("freeBadge")}
            </Badge>
          </div>
          {template.description && (
            <p className="mt-1 text-sm text-[#2D2235]/60">
              {template.description}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ── Common fields ─────────────────────────────────────────────── */}
          <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#2D2235]">
              {t("sectionSubject")}
            </h2>

            <div>
              <Label htmlFor="subjectName">{t("subjectName")} *</Label>
              <Input
                id="subjectName"
                required
                value={form.subjectName}
                onChange={(e) => set("subjectName", e.target.value)}
                placeholder={t("subjectNamePlaceholder")}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="age">{t("age")}</Label>
                <Input
                  id="age"
                  type="number"
                  min={0}
                  max={120}
                  value={form.age}
                  onChange={(e) => set("age", e.target.value)}
                  placeholder={t("agePlaceholder")}
                />
              </div>
              <div>
                <Label htmlFor="birthday">{t("birthday")}</Label>
                <Input
                  id="birthday"
                  type="date"
                  value={form.birthday}
                  onChange={(e) => set("birthday", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="occasion">{t("occasion")}</Label>
              <select
                id="occasion"
                value={form.occasion}
                onChange={(e) => set("occasion", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#2D2235]/15 bg-white px-3 py-2 text-sm text-[#2D2235] focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
              >
                <option value="birthday">{t("occasionBirthday")}</option>
                <option value="adoption">{t("occasionAdoption")}</option>
                <option value="graduation">{t("occasionGraduation")}</option>
                <option value="other">{t("occasionOther")}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="blessingMessage">
                {t("blessingMessage")} *
              </Label>
              <Textarea
                id="blessingMessage"
                required
                rows={3}
                value={form.blessingMessage}
                onChange={(e) => set("blessingMessage", e.target.value)}
                placeholder={t("blessingMessagePlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="specialNotes">{t("specialNotes")}</Label>
              <Textarea
                id="specialNotes"
                rows={2}
                value={form.specialNotes}
                onChange={(e) => set("specialNotes", e.target.value)}
                placeholder={t("specialNotesPlaceholder")}
              />
            </div>
          </section>

          {/* ── Media upload ──────────────────────────────────────────────── */}
          <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-semibold text-[#2D2235]">
              {t("sectionMedia")}
            </h2>

            <div>
              <Label>{t("uploadPhoto")}</Label>
              <p className="mb-1 text-xs text-[#2D2235]/50">{t("uploadPhotoHint")}</p>
              <input
                type="file"
                accept="image/*"
                multiple
                className="w-full text-sm text-[#2D2235]/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#FF6B8A]/10 file:px-4 file:py-1.5 file:text-sm file:text-[#FF6B8A] file:font-medium hover:file:bg-[#FF6B8A]/20"
                onChange={(e) =>
                  set("photoFiles", Array.from(e.target.files ?? []))
                }
              />
              {form.photoFiles.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {form.photoFiles.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-[#2D2235]/60">
                      <span className="text-[#FF6B8A]">🖼</span> {f.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <Label>{t("uploadVoice")}</Label>
              <p className="mb-1 text-xs text-[#2D2235]/50">{t("uploadVoiceHint")}</p>
              <input
                type="file"
                accept="audio/*"
                multiple
                className="w-full text-sm text-[#2D2235]/70 file:mr-3 file:rounded-full file:border-0 file:bg-[#60C8FF]/10 file:px-4 file:py-1.5 file:text-sm file:text-[#60C8FF] file:font-medium hover:file:bg-[#60C8FF]/20"
                onChange={(e) =>
                  set("voiceFiles", Array.from(e.target.files ?? []))
                }
              />
              {form.voiceFiles.length > 0 && (
                <ul className="mt-1.5 space-y-0.5">
                  {form.voiceFiles.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-[#2D2235]/60">
                      <span className="text-[#60C8FF]">🎵</span> {f.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* ── Per-category extras ───────────────────────────────────────── */}
          {template.category === "toddler" && (
            <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-[#2D2235]">{t("sectionExtra")}</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("toddler.favouriteColour")}</Label>
                  <Input
                    value={form.favouriteColour}
                    onChange={(e) => set("favouriteColour", e.target.value)}
                    placeholder={t("toddler.favouriteColourPlaceholder")}
                  />
                </div>
                <div>
                  <Label>{t("toddler.favouriteAnimal")}</Label>
                  <Input
                    value={form.favouriteAnimal}
                    onChange={(e) => set("favouriteAnimal", e.target.value)}
                    placeholder={t("toddler.favouriteAnimalPlaceholder")}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.bedtimeStory}
                  onChange={(e) => set("bedtimeStory", e.target.checked)}
                  className="h-4 w-4 rounded accent-[#FF6B8A]"
                />
                <span className="text-sm text-[#2D2235]">
                  {t("toddler.bedtimeStory")}
                </span>
              </label>

              {form.bedtimeStory && (
                <div>
                  <Label htmlFor="storyTheme">{t("toddler.storyTheme")}</Label>
                  <Input
                    id="storyTheme"
                    value={form.storyTheme}
                    onChange={(e) => set("storyTheme", e.target.value)}
                    placeholder={t("toddler.storyThemePlaceholder")}
                  />
                </div>
              )}
            </section>
          )}

          {template.category === "kids" && (
            <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-[#2D2235]">{t("sectionExtra")}</h2>
              <div>
                <Label>{t("kids.styleTag")}</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    [
                      ["hero", t("kids.heroStyle")],
                      ["adventure", t("kids.adventureStyle")],
                      ["funny", t("kids.funnyStyle")],
                    ] as [string, string][]
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set("styleTag", val)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                        form.styleTag === val
                          ? "border-[#FF6B8A] bg-[#FF6B8A] text-white"
                          : "border-[#2D2235]/15 text-[#2D2235]/70 hover:border-[#FF6B8A]/50"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {template.category === "adult_fun" && (
            <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-[#2D2235]">{t("sectionExtra")}</h2>

              <div>
                <Label>{t("adultFun.performanceStyle")}</Label>
                <Input
                  value={form.performanceStyle}
                  onChange={(e) => set("performanceStyle", e.target.value)}
                  placeholder={t("adultFun.performanceStylePlaceholder")}
                />
              </div>

              <div>
                <Label>{t("adultFun.language")}</Label>
                <select
                  value={form.language}
                  onChange={(e) => set("language", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#2D2235]/15 bg-white px-3 py-2 text-sm text-[#2D2235] focus:outline-none focus:ring-2 focus:ring-[#FF6B8A]"
                >
                  <option value="">English</option>
                  <option value="zh">中文</option>
                  <option value="both">English + 中文</option>
                </select>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.ageRatingAck}
                  onChange={(e) => set("ageRatingAck", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-[#FF6B8A]"
                />
                <span className="text-sm text-[#2D2235]">
                  {t("adultFun.ageRatingAck")}
                </span>
              </label>
            </section>
          )}

          {template.category === "pet" && (
            <section className="rounded-2xl bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-[#2D2235]">{t("sectionExtra")}</h2>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>{t("pet.petType")}</Label>
                  <Input
                    value={form.petType}
                    onChange={(e) => set("petType", e.target.value)}
                    placeholder={t("pet.petTypePlaceholder")}
                  />
                </div>
                <div>
                  <Label>{t("pet.petName")}</Label>
                  <Input
                    value={form.petName}
                    onChange={(e) => set("petName", e.target.value)}
                    placeholder={t("pet.petNamePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <Label>{t("pet.personality")}</Label>
                <Textarea
                  rows={2}
                  value={form.personality}
                  onChange={(e) => set("personality", e.target.value)}
                  placeholder={t("pet.personalityPlaceholder")}
                />
              </div>

              <div>
                <Label>{t("pet.occasion")}</Label>
                <div className="mt-2 flex gap-2">
                  {(
                    [
                      ["birthday", t("pet.occasionBirthday")],
                      ["adoption", t("pet.occasionAdoption")],
                    ] as [string, string][]
                  ).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set("petOccasion", val)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-all",
                        form.petOccasion === val
                          ? "border-[#6ECFAF] bg-[#6ECFAF] text-white"
                          : "border-[#2D2235]/15 text-[#2D2235]/70 hover:border-[#6ECFAF]/50"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Consent ───────────────────────────────────────────────────── */}
          <section className="rounded-2xl bg-white p-6 shadow-sm space-y-3">
            <h2 className="font-semibold text-[#2D2235]">
              {t("sectionConsent")}
            </h2>

            {showCoppa && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={form.coppaConsent}
                  onChange={(e) => set("coppaConsent", e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded accent-[#FF6B8A]"
                />
                <span className="text-sm text-[#2D2235]">
                  {t("coppaConsent")}
                </span>
              </label>
            )}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={form.portraitConsent}
                onChange={(e) => set("portraitConsent", e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded accent-[#FF6B8A]"
              />
              <span className="text-sm text-[#2D2235]">
                {t("portraitConsent")}
              </span>
            </label>
          </section>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={submitting}
            disabled={!canSubmit}
          >
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}
