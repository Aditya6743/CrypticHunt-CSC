#!/bin/bash
cd frontend

# Generate Auth and DB files
mkdir -p src/lib
mkdir -p "src/app/api/auth/[...nextauth]"
mkdir -p src/app/api/submit
mkdir -p prisma

cat << 'FILE' > src/lib/db.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
FILE

cat << 'FILE' > src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        teamId: { label: "Team ID or Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.teamId || !credentials?.password) return null;
        
        const team = await prisma.team.findFirst({
          where: {
            OR: [
              { teamId: credentials.teamId },
              { leaderEmail: credentials.teamId }
            ]
          }
        });

        if (!team) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, team.passwordHash);

        if (!isPasswordValid) return null;

        return {
          id: team.id,
          name: team.teamName,
          email: team.leaderEmail,
          role: "PARTICIPANT"
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  }
};
FILE

cat << 'FILE' > src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
FILE

