import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifier: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Kimlik bilgileri eksik.");
        }

        const user = await prisma.user.findFirst({
          where: { username: credentials.identifier.toLowerCase() },
        });

        if (!user) {
          throw new Error("Kullanici bulunamadi.");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Sifre hatali.");
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          role: user.role,
          onboarded: user.onboarded,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
        token.email = user.email as string;
        token.username = user.username;
        token.name = user.name;
        token.role = user.role;
        token.onboarded = user.onboarded;
      }
      // When session.update() is called, re-fetch from DB
      if (trigger === "update") {
        const fresh = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { onboarded: true, name: true },
        });
        if (fresh) {
          token.onboarded = fresh.onboarded;
          token.name = fresh.name;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.username = token.username as string;
        session.user.name = token.name as string | null;
        session.user.role = token.role;
        session.user.onboarded = token.onboarded as boolean;
      }
      return session;
    },
  },
};
