"use client";

import { useState } from "react";
import Image from "next/image";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "user" | "admin";
  createdAt: string;
  _count: { orders: number };
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function UserTable({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [rows, setRows] = useState(users);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function toggleRole(userId: string, currentRole: "user" | "admin") {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setUpdating(userId);
    setError(null);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to update role");
        return;
      }

      setRows((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {error && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#F5EEE6] text-left text-xs font-semibold text-[#2D2235]/40 uppercase tracking-wide">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F5EEE6]">
            {rows.map((user) => (
              <tr key={user.id} className="hover:bg-[#FFF8F2] transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name ?? ""}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-[#FF6B8A]/20 flex items-center justify-center text-sm font-bold text-[#FF6B8A]">
                        {(user.name ?? user.email ?? "?")[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-[#2D2235]">
                        {user.name ?? "—"}
                        {user.id === currentUserId && (
                          <span className="ml-1.5 text-[10px] text-[#2D2235]/40">(you)</span>
                        )}
                      </div>
                      <div className="text-xs text-[#2D2235]/40">{user.email}</div>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-[#FF6B8A]/15 text-[#FF6B8A]"
                        : "bg-[#F5EEE6] text-[#2D2235]/60"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-4 py-3 text-[#2D2235]/60">
                  {user._count.orders}
                </td>

                <td className="px-4 py-3 text-[#2D2235]/50">
                  <span title={new Date(user.createdAt).toLocaleString()}>
                    {relativeTime(user.createdAt)}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <button
                    disabled={updating === user.id || user.id === currentUserId}
                    onClick={() => toggleRole(user.id, user.role)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      user.role === "admin"
                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        : "bg-[#FF6B8A]/10 text-[#FF6B8A] hover:bg-[#FF6B8A]/20"
                    }`}
                    title={user.id === currentUserId ? "You cannot change your own role" : undefined}
                  >
                    {updating === user.id
                      ? "Saving…"
                      : user.role === "admin"
                      ? "Remove Admin"
                      : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="py-16 text-center text-sm text-[#2D2235]/40">
            No users found.
          </div>
        )}
      </div>

      <div className="border-t border-[#F5EEE6] px-4 py-3 text-xs text-[#2D2235]/40">
        {rows.length} registered user{rows.length !== 1 ? "s" : ""} total
      </div>
    </div>
  );
}
