import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { AdminOrderTable } from "./order-table";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin.orders" });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true, image: true } },
      template: { select: { name: true, category: true } },
    },
  });

  return (
    <div>
      <p className="mb-4 text-sm text-[#2D2235]/50">
        {t("count", { count: orders.length })}
      </p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 shadow-sm">
          <span className="mb-4 text-5xl">📭</span>
          <p className="text-lg font-semibold text-[#2D2235]">{t("empty")}</p>
          <p className="mt-1 text-sm text-[#2D2235]/50">{t("emptyHint")}</p>
        </div>
      ) : (
        <AdminOrderTable orders={orders as never} />
      )}
    </div>
  );
}
