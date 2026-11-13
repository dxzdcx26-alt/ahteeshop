import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      payPoint: number;
      rewardPoint: number;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
    payPoint?: number;
    rewardPoint?: number;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    payPoint?: number;
    rewardPoint?: number;
    image?: string | null;
  }
}
