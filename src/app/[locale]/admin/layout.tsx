import { notFound } from "next/navigation";
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

  return (
    <main className="min-h-screen bg-[#FFF8F2]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#2D2235]">Admin Dashboard</h1>
            <p className="mt-0.5 text-sm text-[#2D2235]/50">Manage your platform</p>
          </div>
          <span className="rounded-full bg-[#FF6B8A]/10 px-3 py-1 text-xs font-semibold text-[#FF6B8A]">
            Admin
          </span>
        </div>

        <AdminNav locale={locale} />

        {children}
      </div>
    </main>
  );
}
