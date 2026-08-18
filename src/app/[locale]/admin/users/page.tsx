import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UserTable } from "./user-table";

export default async function AdminUsersPage() {
  const session = await auth();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
  });

  return (
    <div>
      <p className="mb-4 text-sm text-[#2D2235]/50">
        {users.length} registered user{users.length !== 1 ? "s" : ""} total
      </p>
      <UserTable
        users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))}
        currentUserId={session!.user.id}
      />
    </div>
  );
}
