"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminNav({
  locale,
  ordersLabel,
  usersLabel,
}: {
  locale: string;
  ordersLabel: string;
  usersLabel: string;
}) {
  const pathname = usePathname();

  const tabs = [
    { label: ordersLabel, href: `/${locale}/admin` },
    { label: usersLabel, href: `/${locale}/admin/users` },
  ];

  return (
    <nav className="mb-6 flex gap-1 rounded-2xl bg-white p-1 shadow-sm w-fit">
      {tabs.map(({ label, href }) => {
        const isActive =
          href === `/${locale}/admin`
            ? pathname === href
            : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-xl px-5 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-[#FF6B8A] text-white"
                : "text-[#2D2235]/60 hover:bg-[#FFF8F2] hover:text-[#2D2235]"
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
