import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/lib/auth";
import { AdminNav } from "./admin-nav";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") notFound();

  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <main className="min-h-screen bg-[#FFF8F2]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2D2235]">{t("title")}</h1>
            <p className="mt-0.5 text-sm text-[#2D2235]/50">{t("subtitle")}</p>
          </div>
          <span className="rounded-full bg-[#FF6B8A]/10 px-3 py-1 text-xs font-semibold text-[#FF6B8A]">
            {t("roleBadge")}
          </span>
        </div>

        <AdminNav locale={locale} ordersLabel={t("tabs.orders")} usersLabel={t("tabs.users")} />

        {children}
      </div>
    </main>
  );
}
