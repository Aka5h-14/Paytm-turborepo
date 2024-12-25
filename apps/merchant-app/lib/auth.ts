import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";
import { AuthOptions } from "next-auth";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }: {
      user: {
        email?: string | null;
        name?: string | null;
      };
      account?: {
        provider?: string | null;
      } | null;
    }) {
      console.log("hi signin");

      // Check if required fields are available
      if (!user?.email || !account?.provider) {
        return false; // Reject sign-in if required fields are missing
      }

      await db.merchant.upsert({
        select: {
          id: true,
        },
        where: {
          email: user.email,
        },
        create: {
          email: user.email,
          name: user.name || "Unknown", // Fallback if name is missing
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
        update: {
          name: user.name || "Unknown",
          auth_type: account.provider === "google" ? "Google" : "Github",
        },
      });

      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
};
