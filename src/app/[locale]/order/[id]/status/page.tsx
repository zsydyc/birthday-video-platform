import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

const STATUS_STEPS = [
  "pending_payment_or_trial",
  "queued",
  "generating",
  "pending_review",
  "pending_user_confirmation",
  "delivered",
  "completed",
] as const;

type OrderStatus = (typeof STATUS_STEPS)[number] | "in_dispute" | "cancelled";

function stepIndex(status: OrderStatus) {
  const idx = STATUS_STEPS.indexOf(status as never);
  return idx === -1 ? 0 : idx;
}

const STATUS_COLOR: Record<string, string> = {
  pending_payment_or_trial: "bg-[#FFCF56]/20 text-[#b38a00]",
  queued: "bg-[#60C8FF]/20 text-[#0077aa]",
  generating: "bg-[#FF6B8A]/20 text-[#c0003a]",
  pending_review: "bg-[#6ECFAF]/20 text-[#2a7a5e]",
  pending_user_confirmation: "bg-[#60C8FF]/20 text-[#0077aa]",
  delivered: "bg-[#6ECFAF]/20 text-[#2a7a5e]",
  completed: "bg-[#6ECFAF]/20 text-[#2a7a5e]",
  in_dispute: "bg-red-100 text-red-700",
  cancelled: "bg-[#2D2235]/10 text-[#2D2235]/60",
};

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = await params;
  const t = await getTranslations("orderFlow");
  const ts = await getTranslations("status");
  const locale = await getLocale();
  const session = await auth();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { template: { select: { name: true, category: true } } },
  });

  if (!order || order.userId !== session?.user?.id) notFound();

  const currentStep = stepIndex(order.status as OrderStatus);
  const isFinal =
    order.status === "completed" ||
    order.status === "cancelled" ||
    order.status === "in_dispute";

  return (
    <main className="min-h-screen bg-[#FFF8F2] px-4 py-12">
      <div className="mx-auto max-w-lg">
        {/* Confirmation header */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6ECFAF]/20 text-3xl">
            🎉
          </div>
          <h1 className="text-2xl font-bold text-[#2D2235]">
            {t("confirmation.title")}
          </h1>
          <p className="mt-1 text-[#2D2235]/60">{t("confirmation.subtitle")}</p>
          <p className="mt-2 text-xs text-[#2D2235]/40">
            {t("confirmation.orderLabel")} #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>

        {/* Status badge */}
        <div className="mb-6 flex justify-center">
          <Badge
            className={STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}
          >
            {ts(order.status as never)}
          </Badge>
        </div>

        {/* Progress tracker */}
        {!isFinal && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="space-y-3">
              {STATUS_STEPS.slice(0, 5).map((step, idx) => {
                const done = idx < currentStep;
                const active = idx === currentStep;
                return (
                  <div key={step} className="flex items-center gap-3">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-[#6ECFAF] text-white"
                          : active
                          ? "bg-[#FF6B8A] text-white animate-pulse"
                          : "bg-[#2D2235]/10 text-[#2D2235]/30"
                      }`}
                    >
                      {done ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        active
                          ? "font-semibold text-[#2D2235]"
                          : done
                          ? "text-[#2D2235]/50 line-through"
                          : "text-[#2D2235]/40"
                      }`}
                    >
                      {ts(step as never)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What's next */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-[#2D2235]">
            {t("confirmation.nextStepsTitle")}
          </h2>
          <ol className="space-y-2">
            {[
              t("confirmation.nextStep1"),
              t("confirmation.nextStep2"),
              t("confirmation.nextStep3"),
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-[#2D2235]/70">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF6B8A]/10 text-xs font-bold text-[#FF6B8A]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/${locale}`}
            className="flex-1 inline-flex items-center justify-center rounded-full border-2 border-[#FF6B8A] px-6 py-3 text-base font-medium text-[#FF6B8A] transition-all hover:bg-[#FF6B8A]/10"
          >
            {t("confirmation.backHome")}
          </Link>
        </div>
      </div>
    </main>
  );
}
