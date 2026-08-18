import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "zsyoscar@gmail.com";

const providers = [
  Google({
    clientId: process.env.AUTH_GOOGLE_ID!,
    clientSecret: process.env.AUTH_GOOGLE_SECRET!,
  }),
  ...(process.env.AUTH_APPLE_ID
    ? [
        Apple({
          clientId: process.env.AUTH_APPLE_ID,
          clientSecret: process.env.AUTH_APPLE_SECRET!,
        }),
      ]
    : []),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id;
      // Always read role fresh from DB — avoids stale adapter cache and handles
      // pre-existing accounts whose role was set after their session was created.
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: { role: true, email: true },
      });
      // Auto-promote admin email on the fly if not yet promoted
      if (dbUser?.email === ADMIN_EMAIL && dbUser.role !== "admin") {
        await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } });
        session.user.role = "admin";
      } else {
        session.user.role = dbUser?.role ?? "user";
      }
      return session;
    },
  },
});
