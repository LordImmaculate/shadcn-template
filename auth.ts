import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { Session, User, DefaultSession } from "next-auth";
import { prisma } from "./prisma";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";

// Extend the Session and User types to include 'role'
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [
    Google,
    GitHub,
    Resend({
      from: process.env.EMAIL_FROM
    })
  ],
  pages: {
    signIn: "/auth/sign-in",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request"
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user && user.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true }
        });
        session.user.id = user.id;
        session.user.role = dbUser?.role || "USER";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    }
  }
});
