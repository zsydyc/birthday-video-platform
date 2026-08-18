"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const ORDER_STATUSES = [
  "pending_payment_or_trial",
  "queued",
  "generating",
  "pending_review",
  "pending_user_confirmation",
  "delivered",
  "completed",
  "in_dispute",
  "cancelled",
] as const;

type OrderStatus = (typeof ORDER_STATUSES)[number];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending_payment_or_trial:  "bg-[#FFCF56]/20 text-[#8a6500]",
  queued:                    "bg-[#60C8FF]/20 text-[#005f8a]",
  generating:                "bg-[#FF6B8A]/20 text-[#8a002a]",
  pending_review:            "bg-purple-100 text-purple-700",
  pending_user_confirmation: "bg-[#60C8FF]/20 text-[#005f8a]",
  delivered:                 "bg-[#6ECFAF]/20 text-[#1e6e4e]",
  completed:                 "bg-[#6ECFAF]/30 text-[#1e6e4e]",
  in_dispute:                "bg-red-100 text-red-700",
  cancelled:                 "bg-gray-100 text-gray-500",
};

const CATEGORY_EMOJI: Record<string, string> = {
  toddler: "🌈", kids: "⚡", adult_fun: "🎉", pet: "🐾",
};

interface Order {
  id: string;
  status: string;
  isFreeTrial: boolean;
  createdAt: string;
  formData: Record<string, unknown>;
  user: { name: string | null; email: string | null; image: string | null };
  template: { name: string; category: string };
}

export function AdminOrderTable({ orders }: { orders: Order[] }) {
  const t = useTranslations("admin.orders");
  const ts = useTranslations("status");
  const tt = useTranslations("admin.time");

  const [rows, setRows] = useState(orders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);

  function relativeTime(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return tt("justNow");
    if (mins < 60) return tt("minutesAgo", { count: mins });
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return tt("hoursAgo", { count: hrs });
    return tt("daysAgo", { count: Math.floor(hrs / 24) });
  }

  const filtered = filterStatus === "all"
    ? rows
    : rows.filter((o) => o.status === filterStatus);

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRows((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Filter bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-[#F5EEE6] px-4 py-3">
        <span className="shrink-0 text-xs font-medium text-[#2D2235]/50">{t("filterLabel")}</span>
        {(["all", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              filterStatus === s
                ? "bg-[#FF6B8A] text-white"
                : "bg-[#FFF8F2] text-[#2D2235]/60 hover:bg-[#FF6B8A]/10"
            }`}
          >
            {s === "all" ? t("filterAll") : ts(s as never)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F5EEE6] text-left text-xs font-semibold text-[#2D2235]/40 uppercase tracking-wide">
              <th className="px-4 py-3">{t("colOrder")}</th>
              <th className="px-4 py-3">{t("colCustomer")}</th>
              <th className="px-4 py-3">{t("colTemplate")}</th>
              <th className="px-4 py-3">{t("colStatus")}</th>
              <th className="px-4 py-3">{t("colDate")}</th>
              <th className="px-4 py-3">{t("colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EEE6]">
            {filtered.map((order) => (
              <>
                <tr
                  key={order.id}
                  className="cursor-pointer hover:bg-[#FFF8F2] transition-colors"
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#2D2235]/60">
                    #{order.id.slice(-8).toUpperCase()}
                    {order.isFreeTrial && (
                      <span className="ml-1.5 rounded-full bg-[#6ECFAF]/20 px-1.5 py-0.5 text-[10px] text-[#1e6e4e]">
                        {t("freeBadge")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-[#2D2235]">
                      {order.user.name ?? "—"}
                    </div>
                    <div className="text-xs text-[#2D2235]/40">
                      {order.user.email}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span>{CATEGORY_EMOJI[order.template.category] ?? "🎂"}</span>
                      <span className="text-[#2D2235]">{order.template.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        STATUS_COLORS[order.status as OrderStatus] ??
                        "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {ts(order.status as never)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#2D2235]/50">
                    <span title={new Date(order.createdAt).toLocaleString()}>
                      {relativeTime(order.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      disabled={updating === order.id}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="rounded-lg border border-[#F5EEE6] bg-white px-2 py-1 text-xs text-[#2D2235] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A] disabled:opacity-50"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {ts(s as never)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>

                {expanded === order.id && (
                  <tr key={`${order.id}-expanded`} className="bg-[#FFF8F2]">
                    <td colSpan={6} className="px-6 py-4">
                      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#2D2235]/40">
                        {t("formDataLabel")}
                      </p>

                      {/* Asset previews */}
                      {(() => {
                        const photoUrls = Array.isArray(order.formData.photoUrls)
                          ? (order.formData.photoUrls as string[])
                          : typeof order.formData.photoUrl === "string"
                          ? [order.formData.photoUrl]
                          : [];
                        const voiceUrls = Array.isArray(order.formData.voiceUrls)
                          ? (order.formData.voiceUrls as string[])
                          : typeof order.formData.voiceUrl === "string"
                          ? [order.formData.voiceUrl]
                          : [];
                        if (!photoUrls.length && !voiceUrls.length) return null;
                        return (
                          <div className="mb-3 flex flex-wrap gap-2">
                            {photoUrls.map((url, i) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg border border-[#FF6B8A]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#FF6B8A] hover:bg-[#FF6B8A]/5"
                              >
                                🖼 {t("viewPhoto")}{photoUrls.length > 1 ? ` ${i + 1}` : ""}
                              </a>
                            ))}
                            {voiceUrls.map((url, i) => (
                              <a
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg border border-[#60C8FF]/30 bg-white px-3 py-1.5 text-xs font-medium text-[#0077aa] hover:bg-[#60C8FF]/5"
                              >
                                🎵 {t("listenAudio")}{voiceUrls.length > 1 ? ` ${i + 1}` : ""}
                              </a>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Text fields */}
                      <div className="grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3">
                        {Object.entries(order.formData)
                          .filter(([k, v]) =>
                            !["photoUrl", "voiceUrl", "photoUrls", "voiceUrls"].includes(k) &&
                            v !== "" && v !== null && v !== undefined && v !== false &&
                            !(Array.isArray(v) && v.length === 0)
                          )
                          .map(([k, v]) => (
                            <div key={k} className="flex gap-2 text-xs">
                              <span className="shrink-0 text-[#2D2235]/40">
                                {k.replace(/([A-Z])/g, " $1").toLowerCase()}
                              </span>
                              <span className="truncate font-medium text-[#2D2235]">
                                {String(v)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-[#2D2235]/40">
            {t("noMatch")}
          </div>
        )}
      </div>
    </div>
  );
}
