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
        
        // Check for Admin first
        const admin = await prisma.admin.findUnique({
          where: { username: credentials.teamId }
        });

        if (admin) {
          const isPasswordValid = await bcrypt.compare(credentials.password, admin.passwordHash);
          if (isPasswordValid) {
            return {
              id: admin.id,
              name: admin.username,
              email: admin.username,
              role: "ADMIN"
            };
          }
        }

        // Check for Team
        const team = await prisma.team.findFirst({
          where: {
            OR: [
              { teamId: credentials.teamId.trim().toUpperCase() },
              { leaderEmail: credentials.teamId.trim().toLowerCase() }
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
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
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
  },
  secret: process.env.NEXTAUTH_SECRET || "cryptic_hunt_fallback_super_secret_key_2026",
};
