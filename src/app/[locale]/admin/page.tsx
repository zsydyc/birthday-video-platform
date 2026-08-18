import { prisma } from "@/lib/prisma";
import { AdminOrderTable } from "./order-table";

export default async function AdminOrdersPage() {
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
        {orders.length} order{orders.length !== 1 ? "s" : ""} total
      </p>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-24 shadow-sm">
          <span className="mb-4 text-5xl">📭</span>
          <p className="text-lg font-semibold text-[#2D2235]">No orders yet</p>
          <p className="mt-1 text-sm text-[#2D2235]/50">
            Orders will appear here once customers start ordering.
          </p>
        </div>
      ) : (
        <AdminOrderTable orders={orders as never} />
      )}
    </div>
  );
}
