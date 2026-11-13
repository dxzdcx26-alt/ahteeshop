import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user || user.status === "banned") return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          role: user.role,
          image: user.image,
          payPoint: user.payPoint,
          rewardPoint: user.rewardPoint,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.payPoint = (user as any).payPoint;
        token.rewardPoint = (user as any).rewardPoint;
        token.image = (user as any).image;
      }
      if (trigger === "update" && session) {
        if (session.payPoint !== undefined) token.payPoint = session.payPoint;
        if (session.rewardPoint !== undefined) token.rewardPoint = session.rewardPoint;
        if (session.image !== undefined) token.image = session.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).payPoint = token.payPoint ?? 0;
        (session.user as any).rewardPoint = token.rewardPoint ?? 0;
        (session.user as any).image = token.image;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
});
