import { redirect } from "next/navigation";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const STATUS_COLOR: Record<string, string> = {
  pending_payment_or_trial: "bg-[#FFCF56]/20 text-[#b38a00]",
  queued:                   "bg-[#60C8FF]/20 text-[#0077aa]",
  generating:               "bg-[#FF6B8A]/20 text-[#c0003a]",
  pending_review:           "bg-purple-100 text-purple-700",
  pending_user_confirmation:"bg-[#60C8FF]/20 text-[#0077aa]",
  delivered:                "bg-[#6ECFAF]/20 text-[#2a7a5e]",
  completed:                "bg-[#6ECFAF]/20 text-[#2a7a5e]",
  in_dispute:               "bg-red-100 text-red-700",
  cancelled:                "bg-[#2D2235]/10 text-[#2D2235]/60",
};

const CATEGORY_EMOJI: Record<string, string> = {
  toddler: "🌈", kids: "⚡", adult_fun: "🎉", pet: "🐾",
};

export default async function MyOrdersPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user) {
    redirect(`/api/auth/signin?callbackUrl=/${locale}/orders`);
  }

  const t = await getTranslations("myOrders");
  const ts = await getTranslations("status");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      template: { select: { name: true, category: true } },
    },
  });

  return (
    <main className="min-h-screen bg-[#FFF8F2] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#2D2235]">{t("title")}</h1>
          <p className="mt-1 text-sm text-[#2D2235]/50">
            {t("count", { count: orders.length })}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 shadow-sm text-center">
            <span className="mb-4 text-5xl">🎂</span>
            <p className="text-lg font-semibold text-[#2D2235]">{t("empty")}</p>
            <p className="mt-1 mb-6 text-sm text-[#2D2235]/50">{t("emptyHint")}</p>
            <Link
              href={`/${locale}/order`}
              className="rounded-full bg-[#FF6B8A] px-6 py-3 text-sm font-semibold text-white transition-all hover:opacity-90"
            >
              {t("createCta")}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => {
              const formData = order.formData as Record<string, unknown>;
              return (
                <Link
                  key={order.id}
                  href={`/${locale}/order/${order.id}/status`}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF8F2] text-2xl">
                    {CATEGORY_EMOJI[order.template.category] ?? "🎂"}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#2D2235] truncate">
                        {order.template.name}
                      </p>
                      {order.isFreeTrial && (
                        <span className="shrink-0 rounded-full bg-[#6ECFAF]/20 px-2 py-0.5 text-[10px] font-semibold text-[#2a7a5e]">
                          {t("freeBadge")}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-[#2D2235]/50">
                      {formData.subjectName
                        ? t("forSubject", { name: String(formData.subjectName) })
                        : `#${order.id.slice(-8).toUpperCase()}`}
                      {" · "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                      STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {ts(order.status as never)}
                  </span>

                  <svg className="h-4 w-4 shrink-0 text-[#2D2235]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
