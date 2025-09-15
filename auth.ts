import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import { prisma } from "./prisma";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";

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
    // signOut: "/auth/sign-out",
    error: "/auth/error"
  }
});
